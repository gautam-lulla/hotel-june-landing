'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users } from 'lucide-react';

// Contentful client setup
const createContentfulClient = () => {
  // Safe environment variable checking that works in all environments
  const getEnvVar = (key: string) => {
    try {
      return process?.env?.[key] || null;
    } catch {
      return null;
    }
  };
  
  const CONTENTFUL_SPACE_ID = getEnvVar('REACT_APP_CONTENTFUL_SPACE_ID');
  const CONTENTFUL_ACCESS_TOKEN = getEnvVar('REACT_APP_CONTENTFUL_ACCESS_TOKEN');
  
  // Check if we have valid credentials
  const hasValidCredentials = CONTENTFUL_SPACE_ID && CONTENTFUL_ACCESS_TOKEN && 
    CONTENTFUL_SPACE_ID !== 'your-space-id' && CONTENTFUL_ACCESS_TOKEN !== 'your-access-token';
  
  return {
    getEntries: async (contentType) => {
      if (!hasValidCredentials) {
        console.log('🔧 No Contentful credentials found - using fallback content');
        return null; // This will trigger fallback content
      }
      
      try {
        const response = await fetch(
          `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/entries?content_type=${contentType}&access_token=${CONTENTFUL_ACCESS_TOKEN}`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching from Contentful:', error);
        return null;
      }
    },
    getAsset: async (assetId) => {
      if (!hasValidCredentials) {
        return null;
      }
      
      try {
        const response = await fetch(
          `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/assets/${assetId}?access_token=${CONTENTFUL_ACCESS_TOKEN}`
        );
        const asset = await response.json();
        return asset.fields.file.url;
      } catch (error) {
        console.error('Error fetching asset:', error);
        return null;
      }
    }
  };
};

const HotelJuneLanding = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAmenityIndex, setCurrentAmenityIndex] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false for demo
  const [error, setError] = useState(null);

  const client = createContentfulClient();

  // Fetch data from Contentful
  useEffect(() => {
    const fetchData = async () => {
      // Safe environment check that works in all environments
      const getEnvVar = (key) => {
        try {
          return (typeof process !== 'undefined' && process?.env?.[key]) || null;
        } catch {
          return null;
        }
      };
      
      // Check if we have API credentials first
      const hasCredentials = getEnvVar('REACT_APP_CONTENTFUL_SPACE_ID') && 
        getEnvVar('REACT_APP_CONTENTFUL_ACCESS_TOKEN');
      
      if (!hasCredentials) {
        console.log('🎨 Demo mode: Using beautiful fallback content');
        return; // Skip loading, use fallback data
      }
      
      try {
        setLoading(true);
        
        // Fetch different content types
        const [
          hotelPageData,
          bungalowData, 
          amenitiesData,
          journalData
        ] = await Promise.all([
          client.getEntries('hotelPage'),
          client.getEntries('bungalow'),
          client.getEntries('amenity'),
          client.getEntries('journalPost')
        ]);

        // Process and structure the data
        const processedData = {
          hero: hotelPageData?.items?.[0]?.fields || {},
          bungalows: bungalowData?.items || [],
          amenities: amenitiesData?.items || [],
          journalPosts: journalData?.items || []
        };

        setPageData(processedData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback data matching the combined design exactly
  const fallbackData = {
    hero: {
      title: "Boutique Hotels in Malibu and West LA",
      subtitle: "Where It's Saturday Afternoon All Year Long",
      heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop",
      welcomeTitle: "Welcome to Hotel June",
      welcomeDescription: "A boutique hotel brand offering unique experiences across California's most inspiring locations. Each Hotel June property celebrates the local culture, from Malibu's coastal charm to West LA's creative energy."
    },
    locations: [
      {
        name: "West LA",
        description: "Located in West Hollywood, offering easy access to Santa Monica and Venice. Hotel June West LA provides a stylish urban retreat.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
      },
      {
        name: "Malibu", 
        description: "Our flagship location nestled in four lush acres along the Pacific Coast Highway. Private beach access and canyon views.",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"
      }
    ],
    caravanSection: {
      title: "Golden Hour Starts Here",
      description: "Caravan Swim Club & bistro brings a taste of timeless French Riviera glamour with a California twist. Experience poolside dining and cocktails as the sun sets over Malibu.",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop"
    },
    pressSection: {
      title: "In The Press",
      mentions: [
        {
          publication: "Travel + Leisure",
          title: "The Best New Hotels in Los Angeles",
          logo: "https://images.unsplash.com/photo-1586953983027-d7508a64f4bb?w=200&h=100&fit=crop"
        },
        {
          publication: "Condé Nast Traveler", 
          title: "The Best New Hotels: Gold List 2025",
          logo: "https://images.unsplash.com/photo-1586953983027-d7508a64f4bb?w=200&h=100&fit=crop"
        },
        {
          publication: "Wallpaper*",
          title: "The Aura of Relaxed Beach Living",
          logo: "https://images.unsplash.com/photo-1586953983027-d7508a64f4bb?w=200&h=100&fit=crop"
        }
      ]
    },
    journalPosts: [
      {
        date: "WEST LA | FEBRUARY 21, 2025",
        title: "Health and Wellness: Yoga, Spas, and Fitness on the West Side",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
      },
      {
        date: "MALIBU | FEBRUARY 21, 2025", 
        title: "Hotel June by Chelsea Cutler",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
      },
      {
        date: "WEST LA | FEBRUARY 15, 2025",
        title: "The Best of Santa Monica: A Guide to Restaurants, Shopping, Wellness, and Outdoor Activities",
        image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop"
      }
    ]
  };

  // Use Contentful data if available, otherwise fallback
  const data = pageData || fallbackData;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 font-light">Loading Hotel June experience...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-light">Error loading content: {error}</p>
          <p className="text-stone-600 font-light">Falling back to demo content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-between items-center">
          <div className="text-white font-light tracking-wider">
            <div className="text-xl font-light">hotel june</div>
            <div className="text-xs opacity-75 tracking-widest">DESTINATIONS</div>
          </div>
          <button className="text-white text-sm tracking-wider opacity-75 hover:opacity-100 font-light">
            DESTINATIONS ▼
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data.hero.heroImage}')`
          }}
        >
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
            {data.hero.title}
          </h1>
          <h2 className="text-6xl md:text-8xl font-light mb-16 leading-tight">
            {data.hero.subtitle}
          </h2>
          
          {/* Booking Widget */}
          <div className="bg-white/95 backdrop-blur-sm rounded-none p-6 flex flex-wrap items-center gap-6 text-black max-w-5xl w-full">
            <div className="flex items-center text-left">
              <MapPin className="w-5 h-5 mr-3 text-stone-600" />
              <div>
                <div className="text-xs font-medium text-stone-500 tracking-wider">SELECT LOCATION</div>
                <div className="font-medium text-stone-900">Choose Location</div>
              </div>
            </div>
            <div className="flex items-center text-left">
              <Calendar className="w-5 h-5 mr-3 text-stone-600" />
              <div>
                <div className="text-xs font-medium text-stone-500 tracking-wider">ADD DATES</div>
                <div className="font-medium text-stone-900">Check availability</div>
              </div>
            </div>
            <div className="flex items-center text-left">
              <Users className="w-5 h-5 mr-3 text-stone-600" />
              <div>
                <div className="text-xs font-medium text-stone-500 tracking-wider">TOTAL GUESTS</div>
                <div className="font-medium text-stone-900">2 guests</div>
              </div>
            </div>
            <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-8 transition-colors tracking-wide">
              BOOK NOW
            </button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-stone-900">
            {data.hero.welcomeTitle}
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data.hero.welcomeDescription}
          </p>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-light text-center mb-16 text-stone-900">Locations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {data.locations.map((location, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={location.image}
                  alt={location.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h4 className="text-2xl font-light mb-4 text-stone-900">{location.name}</h4>
                  <p className="text-stone-600 leading-relaxed mb-6 font-light">
                    {location.description}
                  </p>
                  <button className="bg-stone-900 text-white px-6 py-2 text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors">
                    EXPLORE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caravan/Golden Hour Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 bg-stone-200 rounded-full mb-8 flex items-center justify-center">
                <div className="text-stone-600 font-light text-xs">LOGO</div>
              </div>
              <h3 className="text-4xl font-light mb-6 text-stone-900">
                {data.caravanSection.title}
              </h3>
              <p className="text-stone-600 leading-relaxed mb-8 font-light">
                {data.caravanSection.description}
              </p>
              <button className="bg-amber-500 text-black px-8 py-3 font-medium tracking-wide hover:bg-amber-600 transition-colors">
                VISIT CARAVAN
              </button>
            </div>
            
            <div>
              <img 
                src={data.caravanSection.image}
                alt="Caravan Swim Club"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* In The Press Section */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-light text-center mb-16">In The Press</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.pressSection.mentions.map((mention, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 h-20 rounded mb-6 flex items-center justify-center">
                  <span className="text-white/60 text-sm font-light">{mention.publication}</span>
                </div>
                <h4 className="text-xl font-light leading-tight">
                  "{mention.title}"
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* June Journal Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4 text-stone-900">June Journal</h3>
            <p className="text-stone-600 font-light">
              Feast the June — what's inspiring us right now, from local art to the music to neighborhood discoveries and everything in between.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.journalPosts.map((post, index) => (
              <div key={index} className="group cursor-pointer">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
                />
                <div className="text-xs text-stone-500 mb-2 tracking-wider font-medium">
                  {post.date}
                </div>
                <h4 className="text-xl font-light leading-tight group-hover:text-stone-600 transition-colors text-stone-900 mb-4">
                  {post.title}
                </h4>
                <button className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors tracking-wide">
                  READ MORE
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-light mb-8 text-stone-900">Follow us @hoteljunemalibu and @hoteljunewestla</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="aspect-square bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-light mb-8 text-stone-900">Be the first to know everything about Hotel June.</h4>
          <div className="flex gap-4">
            <input 
              type="email" 
              placeholder="Email Address"
              className="flex-1 px-4 py-3 border border-stone-300 focus:outline-none focus:border-stone-500 font-light"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 font-medium transition-colors tracking-wide">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-light text-stone-900 text-lg mb-4">hotel june</h5>
            </div>
            <div>
              <h6 className="font-medium mb-4 text-sm tracking-wider text-stone-700">HOTELS</h6>
              <div className="space-y-2 text-sm text-stone-600 font-light">
                <div className="hover:text-stone-900 cursor-pointer transition-colors">CONTACT</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">CAREERS</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">PRESS</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">GIFT CARDS</div>
              </div>
            </div>
            <div>
              <h6 className="font-medium mb-4 text-sm tracking-wider text-stone-700">ADVENTURES</h6>
              <div className="space-y-2 text-sm text-stone-600 font-light">
                <div className="hover:text-stone-900 cursor-pointer transition-colors">TERMS OF USE</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">PRIVACY POLICY</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">ACCESSIBILITY</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">SELECT LANGUAGE</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-stone-600 font-light mb-4">
                A Proper Hospitality Hotel
              </div>
              <div className="space-y-1 text-sm text-stone-600 font-light">
                <div className="hover:text-stone-900 cursor-pointer transition-colors">PROPER HOTELS</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">HOTEL JUNE</div>
                <div className="hover:text-stone-900 cursor-pointer transition-colors">THE COLLECTION</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelJuneLanding;