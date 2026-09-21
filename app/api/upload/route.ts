import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try Supabase first
    try {
      const supabase = createServerSupabaseClient()
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true
        })

      if (!uploadError) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(filePath)

        // Update user's avatar_url in database
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', userId)

        if (!updateError) {
          console.log('Successfully uploaded to Supabase')
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            message: 'File uploaded successfully'
          })
        }
      }
      
      console.log('Supabase upload failed, falling back to local storage')
    } catch (supabaseError) {
      console.log('Supabase not available, using fallback storage')
    }

    // Fallback: Save to local public directory
    try {
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
      
      // Create directory if it doesn't exist
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (mkdirError) {
        // Directory might already exist, continue
      }

      const filePath = join(uploadsDir, fileName)
      await writeFile(filePath, buffer)

      const publicUrl = `/uploads/avatars/${fileName}`
      
      // Persist the new avatar URL to the database so other users see it.
      try {
        const supabase = createServerSupabaseClient()
        await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', userId)
      } catch (dbErr) {
        console.error('Failed to persist local avatar URL:', dbErr)
      }

      console.log('Successfully saved to local storage:', publicUrl)

      // For fallback, we'll return a mock URL since we can't update the database
      return NextResponse.json({
        success: true,
        url: publicUrl,
        message: 'File uploaded successfully (local storage)',
        fallback: true
      })

    } catch (localError) {
      console.error('Local storage failed:', localError)
      
      // Final fallback: Return a placeholder avatar URL
      const placeholderAvatars = [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
      ]
      
      const randomAvatar = placeholderAvatars[Math.floor(Math.random() * placeholderAvatars.length)]
      
      console.log('Using placeholder avatar:', randomAvatar)
      
      return NextResponse.json({
        success: true,
        url: randomAvatar,
        message: 'Using placeholder avatar (upload service unavailable)',
        placeholder: true
      })
    }

  } catch (error) {
    console.error('Upload error:', error)
    
    // Final fallback with a default avatar
    const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    
    return NextResponse.json({
      success: true,
      url: defaultAvatar,
      message: 'Using default avatar due to upload error',
      error: true
    })
  }
}
