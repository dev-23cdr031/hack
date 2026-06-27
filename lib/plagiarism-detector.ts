/**
 * Advanced Plagiarism Detection System for HackConnect
 * Implements multiple algorithms for comprehensive text similarity analysis
 */

export interface PlagiarismResult {
  similarity: number
  status: 'ORIGINAL' | 'SUSPICIOUS' | 'PLAGIARIZED'
  matches: PlagiarismMatch[]
  overallScore: number
  recommendations: string[]
}

export interface PlagiarismMatch {
  sourceText: string
  matchedText: string
  similarity: number
  sourceProject: {
    id: string
    title: string
    author: string
    url?: string
  }
  startIndex: number
  endIndex: number
  algorithm: string
}

export interface ProjectData {
  id: string
  title: string
  description: string
  author: string
  technologies: string[]
  github_url?: string
  demo_url?: string
  created_at: string
}

export class PlagiarismDetector {
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
    'his', 'her', 'its', 'our', 'their', 'app', 'application', 'project', 'system', 'platform',
    'using', 'used', 'use', 'create', 'build', 'develop', 'make', 'web', 'mobile', 'software'
  ])

  /**
   * Main plagiarism detection method
   */
  async detectPlagiarism(
    targetProject: ProjectData,
    existingProjects: ProjectData[]
  ): Promise<PlagiarismResult> {
    const matches: PlagiarismMatch[] = []
    
    // Filter out the target project itself
    const compareProjects = existingProjects.filter(p => p.id !== targetProject.id)
    
    for (const project of compareProjects) {
      // Check title similarity
      const titleMatches = this.checkTitleSimilarity(targetProject, project)
      matches.push(...titleMatches)
      
      // Check description similarity
      const descMatches = this.checkDescriptionSimilarity(targetProject, project)
      matches.push(...descMatches)
      
      // Check technology stack similarity
      const techMatches = this.checkTechnologySimilarity(targetProject, project)
      matches.push(...techMatches)
    }
    
    // Calculate overall similarity score
    const overallScore = this.calculateOverallScore(matches)
    
    // Determine status
    const status = this.determineStatus(overallScore)
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(matches, overallScore)
    
    return {
      similarity: overallScore,
      status,
      matches: matches.sort((a, b) => b.similarity - a.similarity),
      overallScore,
      recommendations
    }
  }

  /**
   * Check title similarity using multiple algorithms
   */
  private checkTitleSimilarity(target: ProjectData, source: ProjectData): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = []
    
    // Exact match check
    if (target.title.toLowerCase() === source.title.toLowerCase()) {
      matches.push({
        sourceText: target.title,
        matchedText: source.title,
        similarity: 100,
        sourceProject: {
          id: source.id,
          title: source.title,
          author: source.author,
          url: source.github_url
        },
        startIndex: 0,
        endIndex: target.title.length,
        algorithm: 'Exact Title Match'
      })
    }
    
    // Cosine similarity for titles
    const cosineSim = this.cosineSimilarity(target.title, source.title)
    if (cosineSim > 0.7) {
      matches.push({
        sourceText: target.title,
        matchedText: source.title,
        similarity: Math.round(cosineSim * 100),
        sourceProject: {
          id: source.id,
          title: source.title,
          author: source.author,
          url: source.github_url
        },
        startIndex: 0,
        endIndex: target.title.length,
        algorithm: 'Cosine Similarity (Title)'
      })
    }
    
    return matches
  }

  /**
   * Check description similarity using advanced text analysis
   */
  private checkDescriptionSimilarity(target: ProjectData, source: ProjectData): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = []
    
    // Sentence-level similarity
    const targetSentences = this.splitIntoSentences(target.description)
    const sourceSentences = this.splitIntoSentences(source.description)
    
    for (let i = 0; i < targetSentences.length; i++) {
      for (let j = 0; j < sourceSentences.length; j++) {
        const similarity = this.jaccardSimilarity(targetSentences[i], sourceSentences[j])
        
        if (similarity > 0.6) {
          matches.push({
            sourceText: targetSentences[i],
            matchedText: sourceSentences[j],
            similarity: Math.round(similarity * 100),
            sourceProject: {
              id: source.id,
              title: source.title,
              author: source.author,
              url: source.github_url
            },
            startIndex: target.description.indexOf(targetSentences[i]),
            endIndex: target.description.indexOf(targetSentences[i]) + targetSentences[i].length,
            algorithm: 'Jaccard Similarity (Sentence)'
          })
        }
      }
    }
    
    // N-gram similarity for phrases
    const ngramMatches = this.findNgramMatches(target.description, source.description, source)
    matches.push(...ngramMatches)
    
    return matches
  }

  /**
   * Check technology stack similarity
   */
  private checkTechnologySimilarity(target: ProjectData, source: ProjectData): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = []
    
    const commonTechs = target.technologies.filter(tech => 
      source.technologies.some(sourceTech => 
        sourceTech.toLowerCase() === tech.toLowerCase()
      )
    )
    
    if (commonTechs.length > 0) {
      const similarity = (commonTechs.length / Math.max(target.technologies.length, source.technologies.length)) * 100
      
      if (similarity > 50) {
        matches.push({
          sourceText: target.technologies.join(', '),
          matchedText: source.technologies.join(', '),
          similarity: Math.round(similarity),
          sourceProject: {
            id: source.id,
            title: source.title,
            author: source.author,
            url: source.github_url
          },
          startIndex: 0,
          endIndex: target.technologies.join(', ').length,
          algorithm: 'Technology Stack Match'
        })
      }
    }
    
    return matches
  }

  /**
   * Find N-gram matches between texts
   */
  private findNgramMatches(targetText: string, sourceText: string, source: ProjectData): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = []
    const ngramSize = 5 // 5-word phrases
    
    const targetNgrams = this.generateNgrams(targetText, ngramSize)
    const sourceNgrams = this.generateNgrams(sourceText, ngramSize)
    
    for (const targetNgram of targetNgrams) {
      for (const sourceNgram of sourceNgrams) {
        const similarity = this.levenshteinSimilarity(targetNgram.text, sourceNgram.text)
        
        if (similarity > 0.8) {
          matches.push({
            sourceText: targetNgram.text,
            matchedText: sourceNgram.text,
            similarity: Math.round(similarity * 100),
            sourceProject: {
              id: source.id,
              title: source.title,
              author: source.author,
              url: source.github_url
            },
            startIndex: targetNgram.startIndex,
            endIndex: targetNgram.endIndex,
            algorithm: 'N-gram Analysis'
          })
        }
      }
    }
    
    return matches
  }

  /**
   * Generate N-grams from text
   */
  private generateNgrams(text: string, n: number): Array<{text: string, startIndex: number, endIndex: number}> {
    const words = this.tokenize(text)
    const ngrams: Array<{text: string, startIndex: number, endIndex: number}> = []
    
    for (let i = 0; i <= words.length - n; i++) {
      const ngramWords = words.slice(i, i + n)
      const ngramText = ngramWords.join(' ')
      const startIndex = text.indexOf(ngramText)
      
      ngrams.push({
        text: ngramText,
        startIndex: startIndex,
        endIndex: startIndex + ngramText.length
      })
    }
    
    return ngrams
  }

  /**
   * Cosine similarity algorithm
   */
  private cosineSimilarity(text1: string, text2: string): number {
    const vector1 = this.createVector(text1)
    const vector2 = this.createVector(text2)
    
    const intersection = new Set([...vector1.keys()].filter(x => vector2.has(x)))
    
    let dotProduct = 0
    for (const term of intersection) {
      dotProduct += vector1.get(term)! * vector2.get(term)!
    }
    
    const magnitude1 = Math.sqrt([...vector1.values()].reduce((sum, val) => sum + val * val, 0))
    const magnitude2 = Math.sqrt([...vector2.values()].reduce((sum, val) => sum + val * val, 0))
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0
    
    return dotProduct / (magnitude1 * magnitude2)
  }

  /**
   * Jaccard similarity algorithm
   */
  private jaccardSimilarity(text1: string, text2: string): number {
    const set1 = new Set(this.tokenize(text1))
    const set2 = new Set(this.tokenize(text2))
    
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  /**
   * Levenshtein similarity algorithm
   */
  private levenshteinSimilarity(text1: string, text2: string): number {
    const distance = this.levenshteinDistance(text1, text2)
    const maxLength = Math.max(text1.length, text2.length)
    
    if (maxLength === 0) return 1
    
    return 1 - (distance / maxLength)
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  /**
   * Create term frequency vector
   */
  private createVector(text: string): Map<string, number> {
    const vector = new Map<string, number>()
    const terms = this.tokenize(text)
    
    for (const term of terms) {
      vector.set(term, (vector.get(term) || 0) + 1)
    }
    
    return vector
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word))
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10)
  }

  /**
   * Calculate overall similarity score
   */
  private calculateOverallScore(matches: PlagiarismMatch[]): number {
    if (matches.length === 0) return 0
    
    // Weight different types of matches
    let weightedScore = 0
    let totalWeight = 0
    
    for (const match of matches) {
      let weight = 1
      
      // Higher weight for exact matches
      if (match.algorithm.includes('Exact')) weight = 3
      else if (match.algorithm.includes('Title')) weight = 2.5
      else if (match.algorithm.includes('Technology')) weight = 1.5
      
      weightedScore += match.similarity * weight
      totalWeight += weight
    }
    
    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0
  }

  /**
   * Determine plagiarism status
   */
  private determineStatus(score: number): 'ORIGINAL' | 'SUSPICIOUS' | 'PLAGIARIZED' {
    if (score >= 80) return 'PLAGIARIZED'
    if (score >= 50) return 'SUSPICIOUS'
    return 'ORIGINAL'
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(matches: PlagiarismMatch[], score: number): string[] {
    const recommendations: string[] = []
    
    if (score >= 80) {
      recommendations.push('🚨 High similarity detected. Consider significant revisions to ensure originality.')
      recommendations.push('📝 Rewrite project description using your own words and unique perspective.')
      recommendations.push('🎯 Focus on what makes your project unique and different from existing solutions.')
    } else if (score >= 50) {
      recommendations.push('⚠️ Moderate similarity found. Review and enhance originality.')
      recommendations.push('✨ Add more unique features and personal insights to your project.')
      recommendations.push('🔄 Consider rephrasing descriptions to better reflect your individual approach.')
    } else if (score >= 25) {
      recommendations.push('✅ Good originality level. Minor improvements suggested.')
      recommendations.push('💡 Consider adding more specific details about your implementation.')
    } else {
      recommendations.push('🌟 Excellent originality! Your project appears to be highly unique.')
      recommendations.push('👏 Keep up the great work on creating innovative solutions.')
    }
    
    // Specific recommendations based on match types
    const titleMatches = matches.filter(m => m.algorithm.includes('Title'))
    const techMatches = matches.filter(m => m.algorithm.includes('Technology'))
    
    if (titleMatches.length > 0) {
      recommendations.push('📋 Consider using a more distinctive project title.')
    }
    
    if (techMatches.length > 0) {
      recommendations.push('🛠️ While using similar technologies is common, focus on unique implementation approaches.')
    }
    
    return recommendations
  }
}

// Export singleton instance
export const plagiarismDetector = new PlagiarismDetector()
