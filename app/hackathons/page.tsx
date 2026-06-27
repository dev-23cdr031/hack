"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Home, Compass, Filter, Calendar, MapPin, Users, Trophy, MessageCircle, User, Loader2, Globe, Heart, LayoutGrid, LayoutList } from "lucide-react"
import Link from "next/link"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { HackathonCard } from "@/components/hackathon-card"
import type { Hackathon } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Country and state data for filters
const countries = [
  { value: "afghanistan", label: "Afghanistan" },
  { value: "albania", label: "Albania" },
  { value: "algeria", label: "Algeria" },
  { value: "andorra", label: "Andorra" },
  { value: "angola", label: "Angola" },
  { value: "antigua-and-barbuda", label: "Antigua and Barbuda" },
  { value: "argentina", label: "Argentina" },
  { value: "armenia", label: "Armenia" },
  { value: "australia", label: "Australia" },
  { value: "austria", label: "Austria" },
  { value: "azerbaijan", label: "Azerbaijan" },
  { value: "bahamas", label: "Bahamas" },
  { value: "bahrain", label: "Bahrain" },
  { value: "bangladesh", label: "Bangladesh" },
  { value: "barbados", label: "Barbados" },
  { value: "belarus", label: "Belarus" },
  { value: "belgium", label: "Belgium" },
  { value: "belize", label: "Belize" },
  { value: "benin", label: "Benin" },
  { value: "bhutan", label: "Bhutan" },
  { value: "bolivia", label: "Bolivia" },
  { value: "bosnia-and-herzegovina", label: "Bosnia and Herzegovina" },
  { value: "botswana", label: "Botswana" },
  { value: "brazil", label: "Brazil" },
  { value: "brunei", label: "Brunei" },
  { value: "bulgaria", label: "Bulgaria" },
  { value: "burkina-faso", label: "Burkina Faso" },
  { value: "burundi", label: "Burundi" },
  { value: "cabo-verde", label: "Cabo Verde" },
  { value: "cambodia", label: "Cambodia" },
  { value: "cameroon", label: "Cameroon" },
  { value: "canada", label: "Canada" },
  { value: "central-african-republic", label: "Central African Republic" },
  { value: "chad", label: "Chad" },
  { value: "chile", label: "Chile" },
  { value: "china", label: "China" },
  { value: "colombia", label: "Colombia" },
  { value: "comoros", label: "Comoros" },
  { value: "congo", label: "Congo" },
  { value: "costa-rica", label: "Costa Rica" },
  { value: "croatia", label: "Croatia" },
  { value: "cuba", label: "Cuba" },
  { value: "cyprus", label: "Cyprus" },
  { value: "czech-republic", label: "Czech Republic" },
  { value: "denmark", label: "Denmark" },
  { value: "djibouti", label: "Djibouti" },
  { value: "dominica", label: "Dominica" },
  { value: "dominican-republic", label: "Dominican Republic" },
  { value: "ecuador", label: "Ecuador" },
  { value: "egypt", label: "Egypt" },
  { value: "el-salvador", label: "El Salvador" },
  { value: "equatorial-guinea", label: "Equatorial Guinea" },
  { value: "eritrea", label: "Eritrea" },
  { value: "estonia", label: "Estonia" },
  { value: "eswatini", label: "Eswatini" },
  { value: "ethiopia", label: "Ethiopia" },
  { value: "fiji", label: "Fiji" },
  { value: "finland", label: "Finland" },
  { value: "france", label: "France" },
  { value: "gabon", label: "Gabon" },
  { value: "gambia", label: "Gambia" },
  { value: "georgia", label: "Georgia" },
  { value: "germany", label: "Germany" },
  { value: "ghana", label: "Ghana" },
  { value: "greece", label: "Greece" },
  { value: "grenada", label: "Grenada" },
  { value: "guatemala", label: "Guatemala" },
  { value: "guinea", label: "Guinea" },
  { value: "guinea-bissau", label: "Guinea-Bissau" },
  { value: "guyana", label: "Guyana" },
  { value: "haiti", label: "Haiti" },
  { value: "honduras", label: "Honduras" },
  { value: "hungary", label: "Hungary" },
  { value: "iceland", label: "Iceland" },
  { value: "india", label: "India" },
  { value: "indonesia", label: "Indonesia" },
  { value: "iran", label: "Iran" },
  { value: "iraq", label: "Iraq" },
  { value: "ireland", label: "Ireland" },
  { value: "israel", label: "Israel" },
  { value: "italy", label: "Italy" },
  { value: "jamaica", label: "Jamaica" },
  { value: "japan", label: "Japan" },
  { value: "jordan", label: "Jordan" },
  { value: "kazakhstan", label: "Kazakhstan" },
  { value: "kenya", label: "Kenya" },
  { value: "kiribati", label: "Kiribati" },
  { value: "korea-north", label: "Korea, North" },
  { value: "korea-south", label: "Korea, South" },
  { value: "kosovo", label: "Kosovo" },
  { value: "kuwait", label: "Kuwait" },
  { value: "kyrgyzstan", label: "Kyrgyzstan" },
  { value: "laos", label: "Laos" },
  { value: "latvia", label: "Latvia" },
  { value: "lebanon", label: "Lebanon" },
  { value: "lesotho", label: "Lesotho" },
  { value: "liberia", label: "Liberia" },
  { value: "libya", label: "Libya" },
  { value: "liechtenstein", label: "Liechtenstein" },
  { value: "lithuania", label: "Lithuania" },
  { value: "luxembourg", label: "Luxembourg" },
  { value: "madagascar", label: "Madagascar" },
  { value: "malawi", label: "Malawi" },
  { value: "malaysia", label: "Malaysia" },
  { value: "maldives", label: "Maldives" },
  { value: "mali", label: "Mali" },
  { value: "malta", label: "Malta" },
  { value: "marshall-islands", label: "Marshall Islands" },
  { value: "mauritania", label: "Mauritania" },
  { value: "mauritius", label: "Mauritius" },
  { value: "mexico", label: "Mexico" },
  { value: "micronesia", label: "Micronesia" },
  { value: "moldova", label: "Moldova" },
  { value: "monaco", label: "Monaco" },
  { value: "mongolia", label: "Mongolia" },
  { value: "montenegro", label: "Montenegro" },
  { value: "morocco", label: "Morocco" },
  { value: "mozambique", label: "Mozambique" },
  { value: "myanmar", label: "Myanmar" },
  { value: "namibia", label: "Namibia" },
  { value: "nauru", label: "Nauru" },
  { value: "nepal", label: "Nepal" },
  { value: "netherlands", label: "Netherlands" },
  { value: "new-zealand", label: "New Zealand" },
  { value: "nicaragua", label: "Nicaragua" },
  { value: "niger", label: "Niger" },
  { value: "nigeria", label: "Nigeria" },
  { value: "north-macedonia", label: "North Macedonia" },
  { value: "norway", label: "Norway" },
  { value: "oman", label: "Oman" },
  { value: "pakistan", label: "Pakistan" },
  { value: "palau", label: "Palau" },
  { value: "palestine", label: "Palestine" },
  { value: "panama", label: "Panama" },
  { value: "papua-new-guinea", label: "Papua New Guinea" },
  { value: "paraguay", label: "Paraguay" },
  { value: "peru", label: "Peru" },
  { value: "philippines", label: "Philippines" },
  { value: "poland", label: "Poland" },
  { value: "portugal", label: "Portugal" },
  { value: "qatar", label: "Qatar" },
  { value: "romania", label: "Romania" },
  { value: "russia", label: "Russia" },
  { value: "rwanda", label: "Rwanda" },
  { value: "saint-kitts-and-nevis", label: "Saint Kitts and Nevis" },
  { value: "saint-lucia", label: "Saint Lucia" },
  { value: "saint-vincent-and-the-grenadines", label: "Saint Vincent and the Grenadines" },
  { value: "samoa", label: "Samoa" },
  { value: "san-marino", label: "San Marino" },
  { value: "sao-tome-and-principe", label: "Sao Tome and Principe" },
  { value: "saudi-arabia", label: "Saudi Arabia" },
  { value: "senegal", label: "Senegal" },
  { value: "serbia", label: "Serbia" },
  { value: "seychelles", label: "Seychelles" },
  { value: "sierra-leone", label: "Sierra Leone" },
  { value: "singapore", label: "Singapore" },
  { value: "slovakia", label: "Slovakia" },
  { value: "slovenia", label: "Slovenia" },
  { value: "solomon-islands", label: "Solomon Islands" },
  { value: "somalia", label: "Somalia" },
  { value: "south-africa", label: "South Africa" },
  { value: "south-sudan", label: "South Sudan" },
  { value: "spain", label: "Spain" },
  { value: "sri-lanka", label: "Sri Lanka" },
  { value: "sudan", label: "Sudan" },
  { value: "suriname", label: "Suriname" },
  { value: "sweden", label: "Sweden" },
  { value: "switzerland", label: "Switzerland" },
  { value: "syria", label: "Syria" },
  { value: "taiwan", label: "Taiwan" },
  { value: "tajikistan", label: "Tajikistan" },
  { value: "tanzania", label: "Tanzania" },
  { value: "thailand", label: "Thailand" },
  { value: "timor-leste", label: "Timor-Leste" },
  { value: "togo", label: "Togo" },
  { value: "tonga", label: "Tonga" },
  { value: "trinidad-and-tobago", label: "Trinidad and Tobago" },
  { value: "tunisia", label: "Tunisia" },
  { value: "turkey", label: "Turkey" },
  { value: "turkmenistan", label: "Turkmenistan" },
  { value: "tuvalu", label: "Tuvalu" },
  { value: "uganda", label: "Uganda" },
  { value: "ukraine", label: "Ukraine" },
  { value: "united-arab-emirates", label: "United Arab Emirates" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "united-states", label: "United States" },
  { value: "uruguay", label: "Uruguay" },
  { value: "uzbekistan", label: "Uzbekistan" },
  { value: "vanuatu", label: "Vanuatu" },
  { value: "vatican-city", label: "Vatican City" },
  { value: "venezuela", label: "Venezuela" },
  { value: "vietnam", label: "Vietnam" },
  { value: "yemen", label: "Yemen" },
  { value: "zambia", label: "Zambia" },
  { value: "zimbabwe", label: "Zimbabwe" }
];

// State data by country
const statesByCountry = {
  "india": [
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal-pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west-bengal", label: "West Bengal" },
    { value: "andaman-and-nicobar-islands", label: "Andaman and Nicobar Islands" },
    { value: "chandigarh", label: "Chandigarh" },
    { value: "dadra-and-nagar-haveli-and-daman-and-diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "delhi", label: "Delhi" },
    { value: "jammu-and-kashmir", label: "Jammu and Kashmir" },
    { value: "ladakh", label: "Ladakh" },
    { value: "lakshadweep", label: "Lakshadweep" },
    { value: "puducherry", label: "Puducherry" }
  ],
  "united-states": [
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "arizona", label: "Arizona" },
    { value: "arkansas", label: "Arkansas" },
    { value: "california", label: "California" },
    { value: "colorado", label: "Colorado" },
    { value: "connecticut", label: "Connecticut" },
    { value: "delaware", label: "Delaware" },
    { value: "florida", label: "Florida" },
    { value: "georgia", label: "Georgia" },
    { value: "hawaii", label: "Hawaii" },
    { value: "idaho", label: "Idaho" },
    { value: "illinois", label: "Illinois" },
    { value: "indiana", label: "Indiana" },
    { value: "iowa", label: "Iowa" },
    { value: "kansas", label: "Kansas" },
    { value: "kentucky", label: "Kentucky" },
    { value: "louisiana", label: "Louisiana" },
    { value: "maine", label: "Maine" },
    { value: "maryland", label: "Maryland" },
    { value: "massachusetts", label: "Massachusetts" },
    { value: "michigan", label: "Michigan" },
    { value: "minnesota", label: "Minnesota" },
    { value: "mississippi", label: "Mississippi" },
    { value: "missouri", label: "Missouri" },
    { value: "montana", label: "Montana" },
    { value: "nebraska", label: "Nebraska" },
    { value: "nevada", label: "Nevada" },
    { value: "new-hampshire", label: "New Hampshire" },
    { value: "new-jersey", label: "New Jersey" },
    { value: "new-mexico", label: "New Mexico" },
    { value: "new-delhi", label: "IIT Delhi, New Delhi" },
    { value: "north-carolina", label: "North Carolina" },
    { value: "north-dakota", label: "North Dakota" },
    { value: "ohio", label: "Ohio" },
    { value: "oklahoma", label: "Oklahoma" },
    { value: "oregon", label: "Oregon" },
    { value: "pennsylvania", label: "Pennsylvania" },
    { value: "rhode-island", label: "Rhode Island" },
    { value: "south-carolina", label: "South Carolina" },
    { value: "south-dakota", label: "South Dakota" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "utah", label: "Utah" },
    { value: "vermont", label: "Vermont" },
    { value: "virginia", label: "Virginia" },
    { value: "washington", label: "Washington" },
    { value: "west-virginia", label: "West Virginia" },
    { value: "wisconsin", label: "Wisconsin" },
    { value: "wyoming", label: "Wyoming" },
    { value: "district-of-columbia", label: "District of Columbia" },
    { value: "american-samoa", label: "American Samoa" },
    { value: "guam", label: "Guam" },
    { value: "northern-mariana-islands", label: "Northern Mariana Islands" },
    { value: "puerto-rico", label: "Puerto Rico" },
    { value: "us-virgin-islands", label: "U.S. Virgin Islands" }
  ],
  "united-kingdom": [
    { value: "england", label: "England" },
    { value: "scotland", label: "Scotland" },
    { value: "wales", label: "Wales" },
    { value: "northern-ireland", label: "Northern Ireland" }
  ],
  "canada": [
    { value: "alberta", label: "Alberta" },
    { value: "british-columbia", label: "British Columbia" },
    { value: "manitoba", label: "Manitoba" },
    { value: "new-brunswick", label: "New Brunswick" },
    { value: "newfoundland-and-labrador", label: "Newfoundland and Labrador" },
    { value: "northwest-territories", label: "Northwest Territories" },
    { value: "nova-scotia", label: "Nova Scotia" },
    { value: "nunavut", label: "Nunavut" },
    { value: "ontario", label: "Ontario" },
    { value: "prince-edward-island", label: "Prince Edward Island" },
    { value: "quebec", label: "Quebec" },
    { value: "saskatchewan", label: "Saskatchewan" },
    { value: "yukon", label: "Yukon" }
  ],
  "australia": [
    { value: "australian-capital-territory", label: "Australian Capital Territory" },
    { value: "new-south-wales", label: "New South Wales" },
    { value: "northern-territory", label: "Northern Territory" },
    { value: "queensland", label: "Queensland" },
    { value: "south-australia", label: "South Australia" },
    { value: "tasmania", label: "Tasmania" },
    { value: "victoria", label: "Victoria" },
    { value: "western-australia", label: "Western Australia" }
  ],
  // Add more countries and their states as needed
};

export default function HackathonsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [layoutMode, setLayoutMode] = useState<"grid" | "horizontal">("grid")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joiningId, setJoiningId] = useState<string | null>(null)
  
  // Helper function to get country label from value
  const getCountryLabel = (value: string) => {
    if (value === "all") return "All Countries";
    const country = countries.find(c => c.value === value);
    return country ? country.label : value;
  }
  
  // Helper function to get state label from value
  const getStateLabel = (countryValue: string, stateValue: string) => {
    if (stateValue === "all") return "All States/Regions";
    const states = statesByCountry[countryValue as keyof typeof statesByCountry] || [];
    const state = states.find(s => s.value === stateValue);
    return state ? state.label : stateValue;
  }
  
  // Helper function to get status color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400";
      case "ongoing":
        return "bg-green-500/20 text-green-400";
      case "past":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  }
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Fetch hackathons from API
  useEffect(() => {
    fetchHackathons()
  }, [statusFilter, typeFilter, locationFilter, countryFilter, stateFilter])

  const fetchHackathons = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (typeFilter !== "all") {
        params.append("type", typeFilter)
      }
      if (locationFilter !== "all") {
        params.append("location", locationFilter)
      }
      if (countryFilter !== "all") {
        params.append("country", countryFilter)
      }
      if (stateFilter !== "all") {
        params.append("state", stateFilter)
      }

      console.log('Fetching hackathons with filters:', { 
        status: statusFilter, 
        type: typeFilter,
        location: locationFilter,
        country: countryFilter,
        state: stateFilter
      })

      const response = await fetch(`/api/hackathons?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch hackathons")
      }

      console.log('Fetched hackathons:', data.hackathons?.length || 0)
      setHackathons(data.hackathons || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hackathons")
      console.error("Error fetching hackathons:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinHackathon = async (hackathonId: string) => {
    try {
      setJoiningId(hackathonId)

      // Ensure we have a user id in localStorage; if not, create a lightweight user
      let userId: string | null = null
      try {
        const raw = localStorage.getItem('user')
        const user = raw ? JSON.parse(raw) : null
        userId = user?.id || null
      } catch {}

      if (!userId) {
        const newId = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
        const createRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newId, name: 'Guest User' })
        })
        const createData = await createRes.json()
        if (!createRes.ok) throw new Error(createData?.error || 'Failed to create user')
        localStorage.setItem('user', JSON.stringify({ id: newId }))
        userId = newId
      }

      const res = await fetch(`/api/hackathons/${hackathonId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to register')

      // Save the resolved/created auth user id if backend provided one later
      try {
        if (data?.authUserId && (!userId || userId !== data.authUserId)) {
          localStorage.setItem('user', JSON.stringify({ id: data.authUserId }))
        }
      } catch {}

      alert('Successfully registered!')
      // refresh list to update counts
      fetchHackathons()
    } catch (err: any) {
      alert(err?.message || 'Registration failed')
      console.error('Error joining hackathon:', err)
    } finally {
      setJoiningId(null)
    }
  }

  // Filter hackathons based on search term
  const filteredHackathons = hackathons.filter(hackathon =>
    hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.themes?.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <HamburgerMenu />
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              HackConnect
            </Link>

          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/hackathons"
            className="text-blue-400 font-medium flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Explore
          </Link>
          <Link href="/public" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Globe className="w-4 h-4" />
            Public Access
          </Link>
          <Link href="/teams" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Users className="w-4 h-4" />
            Teams
          </Link>
          <Link
            href="/messages"
            className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Messages
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <User className="w-4 h-4" />
            Profile
          </Link>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explore Hackathons
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Discover amazing hackathons and join the next big innovation challenge
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search hackathons, technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={(value) => {
              setLocationFilter(value);
              if (value !== "country-specific") {
                setCountryFilter("all");
                setStateFilter("all");
              }
            }}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="worldwide">Worldwide</SelectItem>
                <SelectItem value="country-specific">Country Specific</SelectItem>
              </SelectContent>
            </Select>
            {locationFilter === "country-specific" && (
              <Select value={countryFilter} onValueChange={(value) => {
                setCountryFilter(value);
                setStateFilter("all");
              }}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px] overflow-y-auto">
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {locationFilter === "country-specific" && countryFilter !== "all" && (
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="State/Region" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px] overflow-y-auto">
                  <SelectItem value="all">All States/Regions</SelectItem>
                  {statesByCountry[countryFilter as keyof typeof statesByCountry]?.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={fetchHackathons}
              variant="outline"
              className="bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Filter className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
            <p className="text-gray-400">Loading hackathons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-400">Error Loading Hackathons</h3>
              <p className="text-gray-500 mb-8">{error}</p>
              <Button onClick={fetchHackathons} className="bg-blue-600 hover:bg-blue-700 text-white">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Hackathons Grid */}
        {!loading && !error && (
          <>
            {filteredHackathons.length > 0 ? (
              <>
                <div className="mb-6 flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-gray-400">
                      Showing {filteredHackathons.length} hackathon{filteredHackathons.length !== 1 ? 's' : ''}
                      {searchTerm && ` matching "${searchTerm}"`}
                      {statusFilter !== "all" && ` with status "${statusFilter}"`}
                      {typeFilter !== "all" && ` of type "${typeFilter}"`}
                      {locationFilter !== "all" && ` in location "${locationFilter === "worldwide" ? "Worldwide" : "Country Specific"}"`}
                      {countryFilter !== "all" && ` in country "${getCountryLabel(countryFilter)}"`}
                      {stateFilter !== "all" && ` in ${getStateLabel(countryFilter, stateFilter)}`}
                    </p>
                    {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || locationFilter !== "all" || countryFilter !== "all" || stateFilter !== "all") && (
                      <p className="text-sm text-gray-500 mt-1">
                        Active filters:
                        {searchTerm && ` Search: "${searchTerm}"`}
                        {statusFilter !== "all" && ` Status: ${statusFilter}`}
                        {typeFilter !== "all" && ` Type: ${typeFilter}`}
                        {locationFilter !== "all" && ` Location: ${locationFilter === "worldwide" ? "Worldwide" : "Country Specific"}`}
                        {countryFilter !== "all" && ` Country: ${getCountryLabel(countryFilter)}`}
                        {stateFilter !== "all" && ` State/Region: ${getStateLabel(countryFilter, stateFilter)}`}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <span className="text-sm text-gray-400 mr-1">Layout:</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setLayoutMode("grid")}
                            className={`w-9 h-9 ${layoutMode === "grid" ? 'bg-blue-900/50 border-blue-600 text-blue-400' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Grid View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setLayoutMode("horizontal")}
                            className={`w-9 h-9 ${layoutMode === "horizontal" ? 'bg-blue-900/50 border-blue-600 text-blue-400' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}
                          >
                            <LayoutList className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Horizontal View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {layoutMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredHackathons.map((hackathon) => (
                      <div key={hackathon.id} className="h-full">
                        <HackathonCard
                          hackathon={hackathon}
                          onJoin={handleJoinHackathon}
                          joiningId={joiningId}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredHackathons.map((hackathon) => (
                      <div key={hackathon.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col md:flex-row h-full">
                        {/* Left Section - Main Info */}
                        <div className="p-6 flex-grow md:w-2/3">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white pr-2">{hackathon.title}</h3>
                            <Badge className={`${getStatusColor(hackathon.status)} ml-2 whitespace-nowrap`}>{hackathon.status}</Badge>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-5">{hackathon.description}</p>
                          
                          {hackathon.themes && hackathon.themes.length > 0 && (
                            <div className="mb-4">
                              <span className="text-gray-300 text-xs font-medium block mb-2">Themes</span>
                              <div className="flex flex-wrap gap-2">
                                {hackathon.themes.map((theme, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-indigo-900/70 text-indigo-200 hover:bg-indigo-800 border border-indigo-700/50 transition-colors">
                                    {theme}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Right Section - Details & Actions */}
                        <div className="p-6 border-t md:border-t-0 md:border-l border-gray-800 bg-gray-900/80 backdrop-blur-sm md:w-1/3">
                          <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <div className="bg-blue-900/30 p-1.5 rounded-md">
                                <Calendar className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs">Dates</span>
                                <div className="flex flex-col">
                                  <span>{formatDate(hackathon.start_date)}</span>
                                  {hackathon.end_date && <span>to {formatDate(hackathon.end_date)}</span>}
                                </div>
                              </div>
                            </div>
                            
                            {hackathon.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="bg-green-900/30 p-1.5 rounded-md">
                                  <MapPin className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                  <span className="text-gray-400 text-xs">Location</span>
                                  <span className="block">{hackathon.location}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <div className="bg-amber-900/30 p-1.5 rounded-md">
                                <Users className="w-4 h-4 text-amber-400" />
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs">Participants</span>
                                <span className="block">{hackathon.current_participants} registered{hackathon.max_participants ? ` / ${hackathon.max_participants} max` : ''}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <Button
                              onClick={() => handleJoinHackathon(hackathon.id)}
                              disabled={hackathon.status === 'past' || joiningId === hackathon.id}
                              className={`flex-1 ${hackathon.status === 'past' || joiningId === hackathon.id 
                                ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                              }`}
                            >
                              {hackathon.status === 'past' 
                                ? 'Ended' 
                                : (joiningId === hackathon.id ? 'Registering...' : 'Register')
                              }
                            </Button>
                            <Link href={`/hackathons/${hackathon.id}`} className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full border-amber-500 !text-amber-300 hover:!text-amber-200 bg-gradient-to-br from-amber-900/70 to-amber-800/70"
                              >
                                Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-300">
                    {searchTerm || statusFilter !== "all" || typeFilter !== "all" ? "No Hackathons Found" : "No Hackathons Available"}
                  </h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                      ? "Try adjusting your search criteria or filters to find more hackathons."
                      : "We're working hard to bring you exciting hackathons. Check back soon!"
                    }
                  </p>
                  {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || locationFilter !== "all" || countryFilter !== "all" || stateFilter !== "all") && (
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setStatusFilter("all")
                        setTypeFilter("all")
                        setLocationFilter("all")
                        setCountryFilter("all")
                        setStateFilter("all")
                      }}
                      variant="outline"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
