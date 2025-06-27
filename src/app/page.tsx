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

  // Fallback data while loading or if Contentful fails
  const fallbackData = {
    hero: {
      title: "Your Private\nMalibu Retreat",
      subtitle: "Nestled Into Four Lush Acres on PCH",
      heroImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop",
      welcomeTitle: "Welcome to Hotel June Malibu",
      welcomeDescription: "Hotel June Malibu is a unique retreat space for intimate gatherings, corporate offsites, and personal getaways in a sprawling wellness, meditation, and artistic center nestled into four lush acres overlooking the Pacific. When we say it's a place for intimate thought, we mean that we host gatherings, executive get-togethers, wellness group sessions, and retreats. Wellness takes an important role as a Spa featuring therapy and contemplative massage is a big offering and presence in the resort; and corporate groups, perfect setting for traveling CEOs."
    },
    bungalows: {
      title: "Bungalows",
      description: "Discover our variety of sleeping options for visitors on or off of Malibu, from our oceanfront property to our inland courtyard. Choose one that works for you and your party's needs. Located in different areas of the world's bungalows with a private view of the world and the Pacific. Mixed with vine wine along the path and tasting, combined with different moments and nights spent dancing on the Malibu Shore. Mostly visits made on the Malibu.",
      ctaText: "EXPLORE BUNGALOWS",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
      ]
    },
    amenities: {
      title: "Amenities",
      subtitle: "Everything you need and nothing you don't",
      ctaText: "EXPLORE AMENITIES",
      list: [
        "Heated outdoor pool",
        "Poolside and Courtyard & Beachside dining", 
        "Two restaurant & bar destinations",
        "24-hour Wellness",
        "Eight unique meeting room spaces",
        "Pet Friendly"
      ],
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600 font-light">Loading Hotel June experience...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-light">Error loading content: {error}</p>
          <p className="text-stone-600 font-light">Falling back to demo content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-between items-center">
          <div className="text-white font-light tracking-wider">
            <div className="text-xl font-light">hotel june</div>
            <div className="text-xs opacity-75 tracking-widest">MALIBU</div>
          </div>
          <button className="text-white text-sm tracking-wider opacity-75 hover:opacity-100 font-light">
            DESTINATIONS ▼
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white text-center"
               style={{
                 backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data.hero.heroImage || data.hero.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop'}')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
        <div className="max-w-4xl px-6">
          <h1 className="text-6xl md:text-7xl font-light mb-6 leading-tight">
            {data.hero.title?.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < data.hero.title.split('\n').length - 1 && <br />}
              </span>
            )) || "Your Private Malibu Retreat"}
          </h1>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            {data.hero.subtitle || "Nestled Into Four Lush Acres on PCH"}
          </p>
          
          {/* Booking Widget */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center text-left">
                <MapPin className="w-5 h-5 mr-3" />
                <div>
                  <div className="text-xs opacity-75 tracking-wider font-medium">SELECT LOCATION</div>
                  <div className="font-medium">Malibu</div>
                </div>
              </div>
              <div className="flex items-center text-left">
                <Calendar className="w-5 h-5 mr-3" />
                <div>
                  <div className="text-xs opacity-75 tracking-wider font-medium">ADD DATES</div>
                  <div className="font-medium">Check availability</div>
                </div>
              </div>
              <div className="flex items-center text-left">
                <Users className="w-5 h-5 mr-3" />
                <div>
                  <div className="text-xs opacity-75 tracking-wider font-medium">TOTAL GUESTS</div>
                  <div className="font-medium">2 guests</div>
                </div>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-8 rounded-md transition-colors tracking-wide">
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light mb-8 text-center text-stone-900">
            {data.hero.welcomeTitle || "Welcome to Hotel June Malibu"}
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed max-w-4xl mx-auto text-center font-light">
            {data.hero.welcomeDescription || `Hotel June Malibu is a unique retreat space for intimate gatherings, corporate offsites, and personal getaways in a 
            sprawling wellness, meditation, and artistic center nestled into four lush acres overlooking the Pacific. When we 
            say it's a place for intimate thought, we mean that we host gatherings, executive get-togethers, wellness group 
            sessions, and retreats. Wellness takes an important role as a Spa featuring therapy and contemplative massage 
            is a big offering and presence in the resort; and corporate groups, perfect setting for traveling CEOs.`}
          </p>
        </div>
      </section>

      {/* Bungalows Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src={data.bungalows.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'}
                alt="Bungalow"
                className="w-full h-96 object-cover rounded-lg"
              />
              <button 
                onClick={() => setCurrentImageIndex(prev => {
                  const images = data.bungalows.images || [];
                  return prev > 0 ? prev - 1 : images.length - 1;
                })}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 text-stone-700" />
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => {
                  const images = data.bungalows.images || [];
                  return prev < images.length - 1 ? prev + 1 : 0;
                })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ChevronRight className="w-5 h-5 text-stone-700" />
              </button>
              <div className="flex justify-center mt-4 space-x-2">
                {(data.bungalows.images || []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-stone-800' : 'bg-stone-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-light mb-6 text-stone-900">
                {data.bungalows.title || "Bungalows"}
              </h3>
              <p className="text-stone-600 leading-relaxed mb-6 font-light">
                {data.bungalows.description || `Discover our variety of sleeping options for visitors on or off of Malibu, from our oceanfront property to our 
                inland courtyard. Choose one that works for you and your party's needs. Located in different 
                areas of the world's bungalows with a private view of the world and the Pacific. 
                Mixed with vine wine along the path and tasting, combined with different moments and 
                nights spent dancing on the Malibu Shore. Mostly visits made on the Malibu.`}
              </p>
              <button className="bg-stone-900 text-white px-8 py-3 rounded-md hover:bg-stone-800 transition-colors font-medium tracking-wide">
                {data.bungalows.ctaText || "EXPLORE BUNGALOWS"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Malibu Experience Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-light mb-6 text-stone-900">Malibu: A True Local Experience</h3>
              <p className="text-stone-600 leading-relaxed mb-6 font-light">
                Discover an entirely new way to experience Malibu, one of Southern California's most iconic and inspiring destinations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                  alt="Malibu coastline"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop"
                  alt="Malibu pier"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-stone-500 mt-4 font-light">
                The glory of Malibu is unparalleled — a community centered around some of the world's most beautiful beaches, 
                surrounded by nature and filled with endless opportunities for adventure. Point Dume, and Surfrider Beach, one of the hottest 
                surfing and nightlife spots, one of the hottest surfing spots in Malibu's shoreline route along of our coast, natural and free locations.
              </p>
              <button className="mt-6 border border-stone-900 text-stone-900 px-8 py-3 rounded-md hover:bg-stone-900 hover:text-white transition-colors font-medium tracking-wide">
                LEARN MORE
              </button>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=800&fit=crop"
                alt="Malibu experience"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-light mb-6 text-stone-900">
                {data.amenities.title || "Amenities"}
              </h3>
              <p className="text-2xl font-light mb-8 text-stone-700">
                {data.amenities.subtitle || "Everything you need and nothing you don't"}
              </p>
              
              <div className="space-y-4 mb-8">
                {(data.amenities.list || []).map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-stone-400 rounded-full mr-4"></div>
                    <span className="text-stone-600 font-light">
                      {typeof amenity === 'string' ? amenity : amenity.fields?.name || amenity.name}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="bg-stone-900 text-white px-8 py-3 rounded-md hover:bg-stone-800 transition-colors font-medium tracking-wide">
                {data.amenities.ctaText || "EXPLORE AMENITIES"}
              </button>
            </div>
            <div className="relative">
              <img 
                src={data.amenities.images?.[currentAmenityIndex] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'}
                alt="Amenities"
                className="w-full h-96 object-cover rounded-lg"
              />
              <button 
                onClick={() => setCurrentAmenityIndex(prev => {
                  const images = data.amenities.images || [];
                  return prev > 0 ? prev - 1 : images.length - 1;
                })}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 text-stone-700" />
              </button>
              <button 
                onClick={() => setCurrentAmenityIndex(prev => {
                  const images = data.amenities.images || [];
                  return prev < images.length - 1 ? prev + 1 : 0;
                })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ChevronRight className="w-5 h-5 text-stone-700" />
              </button>
              <div className="flex justify-center mt-4 space-x-2">
                {(data.amenities.images || []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAmenityIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentAmenityIndex ? 'bg-stone-800' : 'bg-stone-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* June Journal Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4 text-stone-900">June Journal</h3>
            <p className="text-stone-600 font-light">
              Feast the June — what's inspiring us right now, from local art to the music to neighborhood discoveries and everything in between.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data.journalPosts || []).map((post, index) => (
              <div key={index} className="group cursor-pointer">
                <img 
                  src={post.image || post.fields?.image || post.fields?.featuredImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'}
                  alt={post.title || post.fields?.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
                />
                <div className="text-xs text-stone-500 mb-2 tracking-wider font-medium">
                  {post.date || post.fields?.publishDate || "MALIBU | FEBRUARY 21, 2025"}
                </div>
                <h4 className="text-xl font-light leading-tight group-hover:text-stone-600 transition-colors text-stone-900">
                  {post.title || post.fields?.title || "Hotel June Experience"}
                </h4>
                <button className="mt-4 text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors tracking-wide">
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
              <div key={i} className="aspect-square bg-amber-400 rounded-lg hover:bg-amber-500 transition-colors cursor-pointer"></div>
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
              className="flex-1 px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:border-stone-500 font-light"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-md font-medium transition-colors tracking-wide">
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
              <h5 className="font-light mb-4 text-stone-900 text-lg">hotel june</h5>
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