'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Menu } from 'lucide-react';

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
      title: "Where It's Saturday\nAfternoon All Year Long",
      subtitle: "Boutique Hotels in Malibu and West LA",
      heroImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop",
      welcomeTitle: "Welcome to Hotel June",
      welcomeDescription: "Hotel June is a new hospitality experience featuring boutique hotels in West LA and Malibu. A feeling of independence and community — a place where discerning guests can come to escape responsibility and recover. June Hotels was established after an epiphany that there are hardly any boutique hotels in Los Angeles that embrace the spirit of youth, which can get lost when hotels become too corporate.",
      welcomeImages: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop", 
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop"
      ]
    },
    locations: {
      westLA: {
        title: "West LA",
        description: "Located in West Hollywood with newly opened Catch Steak, a luxury steakhouse paired with Santa Monica and Venice",
        ctaText: "EXPLORE",
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop"
      },
      malibu: {
        title: "Malibu", 
        description: "Our Private Malibu Retreat Nestled Into Four Lush Acres on Pacific Coast Highway",
        ctaText: "EXPLORE",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
      }
    },
    goldenHour: {
      title: "Golden Hour Starts Here",
      description: "Ceramic from Chef & Cesar, every's hottest, Best Mexican restaurant and bar in Los Angeles influenced cooking. With a delightfully tart, smooth texture, this one for tacos. Tune this menu for the life you want to live and this golden hour and stay where the stories are every night here.",
      ctaText: "VISIT CARAVAN",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop"
    },
    journalPosts: [
      {
        date: "WEST LA | FEBRUARY 21, 2024",
        title: "Health and Wellness: Yoga, Spas, and Fitness on the West Side",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
      },
      {
        date: "MALIBU | FEBRUARY 21, 2024", 
        title: "Hotel June by Chelsea Cutler",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
      },
      {
        date: "WEST LA | FEBRUARY 21, 2024",
        title: "The Best of Santa Monica: A Guide to Restaurants, Shopping, Wellness and Attractions",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
      }
    ],
    pressFeatures: [
      {
        publication: "LA EATER",
        title: "Best Boutique Hotels in Los Angeles",
        thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop"
      },
      {
        publication: "T+L MAG", 
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
      {/* Hero Section with Integrated Navigation */}
      <section className="relative h-screen flex flex-col text-white text-center"
               style={{
                 backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data.hero.heroImage || data.hero.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop'}')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
        
        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6">
          {/* Hamburger Menu - Top Left */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Hotel June Logo - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-light text-white">
            hotel june
          </div>
          
          {/* Destinations Dropdown - Top Right */}
          <div className="relative">
            <button className="text-white hover:text-gray-300 transition-colors flex items-center text-sm font-medium tracking-wider">
              DESTINATIONS
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-0 left-0 right-0 bg-black/90 backdrop-blur-sm z-40 pt-20">
            <div className="px-6 py-8 space-y-6">
              <a href="#" className="block text-white text-lg font-medium hover:text-gray-300">STAY</a>
              <a href="#" className="block text-white text-lg font-medium hover:text-gray-300">DINE</a>
              <a href="#" className="block text-white text-lg font-medium hover:text-gray-300">GATHER</a>
              <a href="#" className="block text-white text-lg font-medium hover:text-gray-300">JOURNAL</a>
              <a href="#" className="block text-white text-lg font-medium hover:text-gray-300">CONTACT</a>
            </div>
          </div>
        )}

        {/* Main Hero Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl px-6">
            <h1 className="text-6xl md:text-7xl font-light mb-6 leading-tight">
              {data.hero.title?.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < data.hero.title.split('\n').length - 1 && <br />}
                </span>
              )) || "Where It's Saturday Afternoon All Year Long"}
            </h1>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              {data.hero.subtitle || "Boutique Hotels in Malibu and West LA"}
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
                  <div className="font-medium">West LA & Malibu</div>
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
                {data.hero.welcomeTitle || "Welcome to Hotel June"}
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
                src={data.hero.welcomeImages?.[currentWelcomeIndex] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop'}
                alt="Hotel June Welcome"
                className="w-full h-96 object-cover"
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

      {/* Locations Section - FIXED */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4">Locations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* West LA */}
            <div className="group cursor-pointer">
              <img 
                src={data.locations?.westLA?.image || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop"}
                alt="West LA location"
                className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
              />
              <div className="text-center">
                <h4 className="text-2xl font-light mb-4">{data.locations?.westLA?.title || "West LA"}</h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {data.locations?.westLA?.description || "Located in West Hollywood with newly opened Catch Steak, a luxury steakhouse paired with Santa Monica and Venice"}
                </p>
                <button className="border border-gray-900 text-gray-900 px-8 py-3 rounded hover:bg-gray-900 hover:text-white transition-colors">
                  {data.locations?.westLA?.ctaText || "EXPLORE"}
                </button>
              </div>
            </div>

            {/* Malibu */}
            <div className="group cursor-pointer">
              <img 
                src={data.locations?.malibu?.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"}
                alt="Malibu location"
                className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
              />
              <div className="text-center">
                <h4 className="text-2xl font-light mb-4">{data.locations?.malibu?.title || "Malibu"}</h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {data.locations?.malibu?.description || "Our Private Malibu Retreat Nestled Into Four Lush Acres on Pacific Coast Highway"}
                </p>
                <button className="border border-gray-900 text-gray-900 px-8 py-3 rounded hover:bg-gray-900 hover:text-white transition-colors">
                  {data.locations?.malibu?.ctaText || "EXPLORE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Hour Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src={data.goldenHour?.image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop"}
                alt="Golden Hour dining"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🌅</div>
                </div>
                <h3 className="text-4xl font-light mb-6">
                  {data.goldenHour?.title || "Golden Hour Starts Here"}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
                  {data.goldenHour?.description || "Ceramic from Chef & Cesar, every's hottest, Best Mexican restaurant and bar in Los Angeles influenced cooking. With a delightfully tart, smooth texture, this one for tacos. Tune this menu for the life you want to live and this golden hour and stay where the stories are every night here."}
                </p>
                <button className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors">
                  {data.goldenHour?.ctaText || "VISIT CARAVAN"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In the Press Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-light">In the Press</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data.pressFeatures || []).map((feature, index) => (
              <div key={index} className="text-center">
                <img 
                  src={feature.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop'}
                  alt={feature.publication}
                  className="w-12 h-12 object-cover mb-4 mx-auto"
                />
                <div className="bg-gray-100 p-4 text-center">
                  <h4 className="text-lg font-light mb-2 text-center">"{feature.title}"</h4>
                  <p className="text-gray-600 text-xs mb-3 text-center">{feature.publication}</p>
                  <div className="text-center">
                    <button className="text-xs font-medium border border-gray-900 text-gray-900 px-3 py-1 bg-transparent hover:bg-gray-900 hover:text-white transition-colors">
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
                  className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
                />
                <div className="text-xs text-gray-500 mb-2 tracking-wider">
                  {post.date || post.fields?.publishDate || "WEST LA | FEBRUARY 21, 2024"}
                </div>
                <h4 className="text-xl font-light leading-tight group-hover:text-gray-600 transition-colors">
                  {post.title || post.fields?.title || "Hotel June Experience"}
                </h4>
                <button className="mt-4 text-sm font-medium border border-gray-900 text-gray-900 px-4 py-2 bg-transparent hover:bg-gray-900 hover:text-white transition-colors">
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
            <div className="overflow-hidden">
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
                      className="w-full aspect-square object-cover hover:opacity-90 transition-opacity cursor-pointer"
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
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h4 className="text-xl font-light mb-6">Be the first to know everything about Hotel June.</h4>
          <div className="flex gap-3">
            <input 
              type="email" 
              placeholder="Email Address"
              className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 text-sm"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 font-medium transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h5 className="font-medium mb-3 text-sm">HOTEL JUNE</h5>
              <p className="text-gray-600 text-xs">
                Your Private Malibu Retreat
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-3 text-sm">STAY</h5>
              <ul className="space-y-1 text-xs text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Bungalows</a></li>
                <li><a href="#" className="hover:text-gray-900">Amenities</a></li>
                <li><a href="#" className="hover:text-gray-900">Book Now</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-3 text-sm">DISCOVER</h5>
              <ul className="space-y-1 text-xs text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Dining</a></li>
                <li><a href="#" className="hover:text-gray-900">Wellness</a></li>
                <li><a href="#" className="hover:text-gray-900">Events</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-3 text-sm">CONNECT</h5>
              <ul className="space-y-1 text-xs text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Press</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-600">
            <p>&copy; 2025 Hotel June. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}