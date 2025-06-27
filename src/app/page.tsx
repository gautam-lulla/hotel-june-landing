'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Menu, X } from 'lucide-react';

// Contentful client setup
const createClient = () => {
  const getEnvVar = (key) => {
    try {
      return typeof window !== 'undefined' ? 
        window.process?.env?.[key] || 
        window.env?.[key] || 
        null : 
        process.env?.[key] || null;
    } catch {
      return null;
    }
  };

  const spaceId = getEnvVar('REACT_APP_CONTENTFUL_SPACE_ID');
  const accessToken = getEnvVar('REACT_APP_CONTENTFUL_ACCESS_TOKEN');
  
  if (!spaceId || !accessToken) {
    console.log('🔧 No Contentful credentials found');
    return null;
  }

  return {
    async getEntries(contentType) {
      try {
        const response = await fetch(
          `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=${contentType}&access_token=${accessToken}`
        );
        return await response.json();
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
        return { items: [] };
      }
    }
  };
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAmenityIndex, setCurrentAmenityIndex] = useState(0);
  const [currentSocialIndex, setCurrentSocialIndex] = useState(0); // Added for carousel
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0); // Added for welcome carousel
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load content from Contentful
  useEffect(() => {
    const fetchData = async () => {
      const client = createClient();
      
      if (!client) {
        setLoading(false);
        return;
      }

      const getEnvVar = (key) => {
        try {
          return typeof window !== 'undefined' ? 
            window.process?.env?.[key] || 
            window.env?.[key] || 
            null : 
            process.env?.[key] || null;
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
      welcomeDescription: "Hotel June Malibu is a unique retreat space for intimate gatherings, corporate offsites, and personal getaways in a sprawling wellness, meditation, and artistic center nestled into four lush acres overlooking the Pacific. When we say it's a place for intimate thought, we mean that we host gatherings, executive get-togethers, wellness group sessions, and retreats. Wellness takes an important role as a Spa featuring therapy and contemplative massage is a big offering and presence in the resort; and corporate groups, perfect setting for traveling CEOs.",
      welcomeImages: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop", 
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
      ]
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
        title: "Sunset Rituals: The Magic Hour at Hotel June",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
      }
    ],
    pressFeatures: [
      {
        publication: "Los Angeles Magazine",
        title: "Best Boutique Hotels in Los Angeles",
        thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop"
      },
      {
        publication: "Travel + Leisure", 
        title: "The Best New Hotels",
        thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop"
      },
      {
        publication: "Architectural Digest",
        title: "The Art of Relaxed Beach Living", 
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop"
      }
    ]
  };

  // Use pageData if loaded, otherwise use fallback
  const data = pageData || fallbackData;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-light">HOTEL JUNE</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">STAY</a>
              <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">DINE</a>
              <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">GATHER</a>
              <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">JOURNAL</a>
              <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">CONTACT</a>
            </nav>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-6 py-4 space-y-4">
              <a href="#" className="block text-sm font-medium">STAY</a>
              <a href="#" className="block text-sm font-medium">DINE</a>
              <a href="#" className="block text-sm font-medium">GATHER</a>
              <a href="#" className="block text-sm font-medium">JOURNAL</a>
              <a href="#" className="block text-sm font-medium">CONTACT</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center text-white text-center"
               style={{
                 backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data.hero.heroImage || data.hero.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop'}')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
        {/* Main Hero Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl px-6">
            <h1 className="text-6xl md:text-7xl font-light mb-6 leading-tight">
              {data.hero.title?.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < data.hero.title.split('\n').length - 1 && <br />}
                </span>
              )) || "Your Private Malibu Retreat"}
            </h1>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              {data.hero.subtitle || "Nestled Into Four Lush Acres on PCH"}
            </p>
          </div>
        </div>
        
        {/* Booking Widget - Stuck to Bottom */}
        <div className="px-6 pb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center text-left">
                <MapPin className="w-5 h-5 mr-3" />
                <div>
                  <div className="text-xs opacity-75">SELECT LOCATION</div>
                  <div className="font-medium">Malibu</div>
                </div>
              </div>
              <div className="flex items-center text-left">
                <Calendar className="w-5 h-5 mr-3" />
                <div>
                  <div className="text-xs opacity-75">ADD DATES</div>
                  <div className="font-medium">Check availability</div>
                </div>
              </div>
              <div className="flex items-center text-left">
                <Users className="w-5 h-5 mr-3" />
                <div>
                  <div className="text-xs opacity-75">TOTAL GUESTS</div>
                  <div className="font-medium">2 guests</div>
                </div>
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-black font-medium py-3 px-8 rounded transition-colors">
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light mb-8">
                {data.hero.welcomeTitle || "Welcome to Hotel June Malibu"}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {data.hero.welcomeDescription || `Hotel June Malibu is a unique retreat space for intimate gatherings, corporate offsites, and personal getaways in a 
                sprawling wellness, meditation, and artistic center nestled into four lush acres overlooking the Pacific. When we 
                say it's a place for intimate thought, we mean that we host gatherings, executive get-togethers, wellness group 
                sessions, and retreats. Wellness takes an important role as a Spa featuring therapy and contemplative massage 
                is a big offering and presence in the resort; and corporate groups, perfect setting for traveling CEOs.`}
              </p>
            </div>
            
            {/* Welcome Image Carousel */}
            <div className="relative">
              <img 
                src={data.hero.welcomeImages?.[currentWelcomeIndex] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'}
                alt="Hotel June Welcome"
                className="w-full h-96 object-cover rounded-lg"
              />
              <button 
                onClick={() => setCurrentWelcomeIndex(prev => {
                  const images = data.hero.welcomeImages || [];
                  return prev > 0 ? prev - 1 : images.length - 1;
                })}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentWelcomeIndex(prev => {
                  const images = data.hero.welcomeImages || [];
                  return prev < images.length - 1 ? prev + 1 : 0;
                })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex justify-center mt-4 space-x-2">
                {(data.hero.welcomeImages || []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentWelcomeIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentWelcomeIndex ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bungalows Section */}
      <section className="py-24 bg-gray-50">
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => {
                  const images = data.bungalows.images || [];
                  return prev < images.length - 1 ? prev + 1 : 0;
                })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex justify-center mt-4 space-x-2">
                {(data.bungalows.images || []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-light mb-6">
                {data.bungalows.title || "Bungalows"}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {data.bungalows.description || `Discover our variety of sleeping options for visitors on or off of Malibu, from our oceanfront property to our 
                inland courtyard. Choose one that works for you and your party's needs. Located in different 
                areas of the world's bungalows with a private view of the world and the Pacific. 
                Mixed with vine wine along the path and tasting, combined with different moments and 
                nights spent dancing on the Malibu Shore. Mostly visits made on the Malibu.`}
              </p>
              <button className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors">
                {data.bungalows.ctaText || "EXPLORE BUNGALOWS"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Malibu Experience Section - FIXED */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-light mb-6">Malibu: A True Local Experience</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
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
              {/* FIXED: Container now matches the width of the image grid above */}
              <div className="grid grid-cols-2 gap-4">
                <p className="col-span-2 text-sm text-gray-500 mt-4">
                  The glory of Malibu is unparalleled — a community centered around some of the world's most beautiful beaches, 
                  surrounded by nature and filled with endless opportunities for adventure. Point Dume, and Surfrider Beach, one of the hottest 
                  surfing and nightlife spots, one of the hottest surfing spots in Malibu's shoreline route along of our coast, natural and free locations.
                </p>
              </div>
              <button className="mt-6 border border-gray-900 text-gray-900 px-8 py-3 rounded hover:bg-gray-900 hover:text-white transition-colors">
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
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-light mb-6">
                {data.amenities.title || "Amenities"}
              </h3>
              <p className="text-2xl font-light mb-8 text-gray-700">
                {data.amenities.subtitle || "Everything you need and nothing you don't"}
              </p>
              
              <div className="space-y-4 mb-8">
                {(data.amenities.list || []).map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                    <span className="text-gray-600">
                      {typeof amenity === 'string' ? amenity : amenity.fields?.name || amenity.name}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors">
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentAmenityIndex(prev => {
                  const images = data.amenities.images || [];
                  return prev < images.length - 1 ? prev + 1 : 0;
                })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex justify-center mt-4 space-x-2">
                {(data.amenities.images || []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAmenityIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentAmenityIndex ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In the Press Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4">In the Press</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data.pressFeatures || []).map((feature, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative mb-4">
                  <img 
                    src={feature.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop'}
                    alt={feature.publication}
                    className="w-16 h-16 object-cover rounded-lg mb-4 mx-auto"
                  />
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h4 className="text-xl font-light mb-2">"{feature.title}"</h4>
                    <p className="text-gray-600 text-sm mb-4">{feature.publication}</p>
                    <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                      READ MORE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* June Journal Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4">June Journal</h3>
            <p className="text-gray-600">
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
                <div className="text-xs text-gray-500 mb-2 tracking-wider">
                  {post.date || post.fields?.publishDate || "MALIBU | FEBRUARY 21, 2025"}
                </div>
                <h4 className="text-xl font-light leading-tight group-hover:text-gray-600 transition-colors">
                  {post.title || post.fields?.title || "Hotel June Experience"}
                </h4>
                <button className="mt-4 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                  READ MORE
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section - Golden Hour Carousel - FIXED */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-light mb-8">Follow us @hoteljunemalibu and @hoteljunewestla</h4>
          
          {/* FIXED: Converted to carousel with 5 actual images */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSocialIndex * 20}%)` }}
              >
                {[
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop", 
                  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop"
                ].map((image, index) => (
                  <div 
                    key={index} 
                    className="w-1/5 flex-shrink-0 px-2"
                  >
                    <img 
                      src={image}
                      alt={`Hotel June moment ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel navigation */}
            <button 
              onClick={() => setCurrentSocialIndex(prev => prev > 0 ? prev - 1 : 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentSocialIndex(prev => prev < 1 ? prev + 1 : 0)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Carousel indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSocialIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSocialIndex ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-light mb-8">Be the first to know everything about Hotel June.</h4>
          <div className="flex gap-4">
            <input 
              type="email" 
              placeholder="Email Address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded font-medium transition-colors">
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
              <h5 className="font-medium mb-4">HOTEL JUNE</h5>
              <p className="text-gray-600 text-sm">
                Your Private Malibu Retreat
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-4">STAY</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Bungalows</a></li>
                <li><a href="#" className="hover:text-gray-900">Amenities</a></li>
                <li><a href="#" className="hover:text-gray-900">Book Now</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">DISCOVER</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Dining</a></li>
                <li><a href="#" className="hover:text-gray-900">Wellness</a></li>
                <li><a href="#" className="hover:text-gray-900">Events</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">CONNECT</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Press</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>&copy; 2025 Hotel June. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}