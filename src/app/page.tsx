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
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [poolImageIndex, setPoolImageIndex] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const client = createContentfulClient();

  // Fetch data from Contentful
  useEffect(() => {
    const fetchData = async () => {
      const getEnvVar = (key) => {
        try {
          return (typeof process !== 'undefined' && process?.env?.[key]) || null;
        } catch {
          return null;
        }
      };
      
      const hasCredentials = getEnvVar('REACT_APP_CONTENTFUL_SPACE_ID') && 
        getEnvVar('REACT_APP_CONTENTFUL_ACCESS_TOKEN');
      
      if (!hasCredentials) {
        console.log('🎨 Demo mode: Using beautiful fallback content');
        return;
      }
      
      try {
        setLoading(true);
        
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

  // Fallback data with carousel images
  const fallbackData = {
    hero: {
      title: "Boutique Hotels in Malibu and West LA",
      subtitle: "Where It's Saturday Afternoon All Year Long",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920&h=1080&fit=crop"
      ]
    },
    welcome: {
      title: "Welcome to Hotel June",
      description: "A collection of boutique hotels offering unique experiences across California's most inspiring locations. Each Hotel June property celebrates the local culture, from Malibu's coastal charm to West LA's creative energy."
    },
    locations: [
      {
        name: "West LA",
        description: "Located in West Hollywood with easy access to Santa Monica and Venice. Hotel June West LA provides a stylish urban retreat.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
      },
      {
        name: "Malibu", 
        description: "Our flagship location nestled in four lush acres along the Pacific Coast Highway. Private beach access and canyon views.",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"
      }
    ],
    poolSection: {
      title: "Golden Hour Starts Here",
      description: "Caravan Swim Club & bistro brings a taste of timeless French Riviera glamour with a California twist. Experience poolside dining and cocktails as the sun sets over Malibu.",
      images: [
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop"
      ]
    },
    pressSection: [
      {
        publication: "Travel + Leisure",
        title: "The Best New Hotels in Los Angeles"
      },
      {
        publication: "Condé Nast Traveler", 
        title: "The Best New Hotels: Gold List 2025"
      },
      {
        publication: "Wallpaper*",
        title: "The Aura of Relaxed Beach Living"
      }
    ],
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

  const data = pageData || fallbackData;

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading Hotel June experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading content: {error}</p>
          <p className="text-amber-800">Falling back to demo content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <div className="text-lg md:text-xl">hotel june</div>
            <div className="text-xs opacity-75 tracking-widest">DESTINATIONS</div>
          </div>
          <button className="text-white text-sm opacity-75 hover:opacity-100">
            DESTINATIONS ▼
          </button>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section className="relative h-96 md:h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${data.hero.images[heroImageIndex]}')`
          }}
        />
        
        <div className="relative z-10 h-full flex flex-col justify-center text-white px-6">
          <div className="max-w-6xl mx-auto w-full text-center">
            <h1 className="text-2xl md:text-3xl font-light mb-4 tracking-wide">
              {data.hero.title}
            </h1>
            <h2 className="text-3xl md:text-5xl font-light mb-16 leading-tight">
              {data.hero.subtitle}
            </h2>
            
            {/* Booking Widget */}
            <div className="bg-white text-black p-6 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500 tracking-wider">SELECT LOCATION</div>
                    <div className="font-medium">Choose Location</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500 tracking-wider">ADD DATES</div>
                    <div className="font-medium">Check availability</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500 tracking-wider">TOTAL GUESTS</div>
                    <div className="font-medium">2 guests</div>
                  </div>
                </div>
                <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-8">
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Carousel Controls */}
        <button 
          onClick={() => setHeroImageIndex(prev => prev > 0 ? prev - 1 : data.hero.images.length - 1)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/30 z-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button 
          onClick={() => setHeroImageIndex(prev => prev < data.hero.images.length - 1 ? prev + 1 : 0)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/30 z-20"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Hero Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {data.hero.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === heroImageIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900">
            {data.welcome.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {data.welcome.description}
          </p>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-light text-center mb-16 text-gray-900">Locations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data.locations.map((location, index) => (
              <div key={index} className="bg-white overflow-hidden">
                <img 
                  src={location.image}
                  alt={location.name}
                  className="w-[370px] h-[285px] object-cover"
                />
                <div className="p-8 bg-amber-50 text-center">
                  <h4 className="text-2xl font-light mb-4 text-gray-900">{location.name}</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {location.description}
                  </p>
                  <button className="border border-gray-900 bg-transparent text-gray-900 px-6 py-2 text-sm font-medium tracking-wide hover:bg-gray-900 hover:text-white transition-colors">
                    EXPLORE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pool/Golden Hour Section with Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src={data.poolSection.images[poolImageIndex]}
                alt="Pool and amenities"
                className="w-[394px] h-[514px] object-cover"
              />
              
              {/* Pool Carousel Controls */}
              <button 
                onClick={() => setPoolImageIndex(prev => prev > 0 ? prev - 1 : data.poolSection.images.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <button 
                onClick={() => setPoolImageIndex(prev => prev < data.poolSection.images.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* Pool Carousel Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {data.poolSection.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPoolImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === poolImageIndex ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              {/* Simulated Logo */}
              <div className="w-16 h-16 bg-amber-100 rounded-full mb-8 flex items-center justify-center mx-auto">
                <div className="text-amber-600 font-bold text-sm">HJ</div>
              </div>
              
              <h3 className="text-4xl font-light mb-6 text-gray-900">
                {data.poolSection.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                {data.poolSection.description}
              </p>
              <button className="bg-amber-500 text-black px-8 py-3 font-medium tracking-wide hover:bg-amber-600">
                VISIT CARAVAN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* In The Press Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-light text-center mb-16">In The Press</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.pressSection.map((mention, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 h-20 mb-6 flex items-center justify-center">
                  <span className="text-white/60 text-sm">{mention.publication}</span>
                </div>
                <h4 className="text-xl font-light leading-tight text-center">
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
            <h3 className="text-4xl font-light mb-4 text-gray-900">June Journal</h3>
            <p className="text-gray-600">
              Feast the June — what's inspiring us right now, from local art to the music to neighborhood discoveries and everything in between.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.journalPosts.map((post, index) => (
              <div key={index} className="group cursor-pointer text-center">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
                />
                <div className="text-xs text-gray-500 mb-2 tracking-wider">
                  {post.date}
                </div>
                <h4 className="text-xl font-light leading-tight group-hover:text-gray-600 transition-colors text-gray-900 mb-4">
                  {post.title}
                </h4>
                <button className="text-sm font-medium text-gray-900 hover:text-gray-600 tracking-wide">
                  READ MORE
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-light mb-8 text-gray-900">Follow us @hoteljunemalibu and @hoteljunewestla</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="aspect-square bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-light mb-8 text-gray-900">Be the first to know everything about Hotel June.</h4>
          <div className="flex gap-4">
            <input 
              type="email" 
              placeholder="Email Address"
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 font-medium tracking-wide">
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
              <h5 className="font-light text-gray-900 text-lg mb-4">hotel june</h5>
            </div>
            <div>
              <h6 className="font-medium mb-4 text-sm tracking-wider text-gray-700">HOTELS</h6>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="hover:text-gray-900 cursor-pointer">CONTACT</div>
                <div className="hover:text-gray-900 cursor-pointer">CAREERS</div>
                <div className="hover:text-gray-900 cursor-pointer">PRESS</div>
                <div className="hover:text-gray-900 cursor-pointer">GIFT CARDS</div>
              </div>
            </div>
            <div>
              <h6 className="font-medium mb-4 text-sm tracking-wider text-gray-700">ADVENTURES</h6>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="hover:text-gray-900 cursor-pointer">TERMS OF USE</div>
                <div className="hover:text-gray-900 cursor-pointer">PRIVACY POLICY</div>
                <div className="hover:text-gray-900 cursor-pointer">ACCESSIBILITY</div>
                <div className="hover:text-gray-900 cursor-pointer">SELECT LANGUAGE</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-4">
                A Proper Hospitality Hotel
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="hover:text-gray-900 cursor-pointer">PROPER HOTELS</div>
                <div className="hover:text-gray-900 cursor-pointer">HOTEL JUNE</div>
                <div className="hover:text-gray-900 cursor-pointer">THE COLLECTION</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelJuneLanding;