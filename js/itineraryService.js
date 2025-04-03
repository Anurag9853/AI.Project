
class ItineraryService {
  constructor() {
    // Base URL could be replaced with actual API endpoint
    this.baseUrl = 'https://api.example.com';
    this.mockData = true; // Set to false when using real API
  }

  async fetchItineraryDetails(formData) {
    if (this.mockData) {
      return this._getMockData(formData);
    }

    try {
      // Replace with actual API endpoint when available
      const response = await fetch(`${this.baseUrl}/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching itinerary details:', error);
      throw error;
    }
  }

  _getMockData(formData) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._generateMockItinerary(formData));
      }, 1500);
    });
  }

  _generateMockItinerary(formData) {
    const { destination, days, budget, travelers } = formData;
    const destinationName = destination.split(',')[0].trim();
    
    // Generate different activities based on destination
    let activities;
    let attractions;
    let hostels;
    
    switch (destinationName.toLowerCase()) {
      case 'delhi':
        activities = [
          'Visit the Red Fort and explore its stunning architecture',
          'Experience the vibrant street food at Chandni Chowk',
          'Visit Humayun\'s Tomb and Qutub Minar',
          'Shop at Connaught Place and Janpath Market'
        ];
        attractions = this._generateAttractions('delhi');
        hostels = this._generateHostels('delhi', budget);
        break;
      case 'mumbai':
        activities = [
          'Take a stroll along Marine Drive at sunset',
          'Visit the Gateway of India and take a ferry to Elephanta Caves',
          'Experience the bustling street markets of Colaba',
          'Take a Bollywood studio tour'
        ];
        attractions = this._generateAttractions('mumbai');
        hostels = this._generateHostels('mumbai', budget);
        break;
      case 'jaipur':
        activities = [
          'Explore the magnificent Amber Fort',
          'Visit the City Palace and Jantar Mantar',
          'Shop for traditional Rajasthani textiles and crafts',
          'Experience a cultural evening with folk dance and music'
        ];
        attractions = this._generateAttractions('jaipur');
        hostels = this._generateHostels('jaipur', budget);
        break;
      default:
        activities = [
          `Explore the local markets and cuisine of ${destinationName}`,
          'Visit historical monuments and cultural landmarks',
          'Experience local festivals and traditions',
          'Try regional cuisine at authentic restaurants'
        ];
        attractions = this._generateAttractions(destinationName);
        hostels = this._generateHostels(destinationName, budget);
    }

    return {
      destination,
      days: parseInt(days),
      budget,
      travelers,
      activities: activities.slice(0, Math.min(days * 2, activities.length)),
      attractions,
      hostels,
      weather: this._generateWeather(destinationName),
    };
  }

  _generateAttractions(destination) {
    const attractionsByCity = {
      'delhi': [
        {
          name: 'Red Fort',
          description: 'A historic fort that served as the main residence of the Mughal Emperors. Built in 1639, it\'s an impressive example of Mughal architecture.',
          rating: 4.5,
          isMock: true
        },
        {
          name: 'Qutub Minar',
          description: 'A UNESCO World Heritage Site, this 73m-tall tower of victory was built in 1193 by Qutab-ud-din Aibak after the defeat of Delhi\'s last Hindu kingdom.',
          rating: 4.7,
          isMock: true
        },
        {
          name: 'Humayun\'s Tomb',
          description: 'Built in 1570, this tomb is of particular cultural significance as it was the first garden-tomb on the Indian subcontinent.',
          rating: 4.6,
          isMock: true
        }
      ],
      'mumbai': [
        {
          name: 'Gateway of India',
          description: 'An arch monument built during the 20th century. The monument was erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder.',
          rating: 4.4,
          isMock: true
        },
        {
          name: 'Elephanta Caves',
          description: 'A UNESCO World Heritage Site and a collection of cave temples predominantly dedicated to the Hindu god Shiva.',
          rating: 4.3,
          isMock: true
        },
        {
          name: 'Marine Drive',
          description: 'A 3.6-kilometer-long boulevard in South Mumbai that offers stunning views of the Arabian Sea.',
          rating: 4.8,
          isMock: true
        }
      ],
      'jaipur': [
        {
          name: 'Amber Fort',
          description: 'Built from red sandstone and marble, the attractive and opulent palace is laid out on four levels, each with a courtyard.',
          rating: 4.7,
          isMock: true
        },
        {
          name: 'Hawa Mahal',
          description: 'A palace in Jaipur, made with the red and pink sandstone, the palace sits on the edge of the City Palace.',
          rating: 4.4,
          isMock: true
        },
        {
          name: 'City Palace',
          description: 'A palace complex that includes the Chandra Mahal and Mubarak Mahal palaces and other buildings. It was the seat of the Maharaja of Jaipur.',
          rating: 4.5,
          isMock: true
        }
      ]
    };
    
    // Default attractions if city-specific ones aren't available
    const defaultAttractions = [
      {
        name: `${destination} Heritage Site`,
        description: `One of the most historically significant locations in ${destination}, showcasing the region's rich cultural heritage.`,
        rating: 4.2,
        isMock: true
      },
      {
        name: `${destination} Nature Park`,
        description: `A beautiful natural area offering stunning views and diverse flora and fauna native to the ${destination} region.`,
        rating: 4.3,
        isMock: true
      },
      {
        name: `${destination} Cultural Center`,
        description: `Experience the vibrant local culture through art, performances, and exhibitions celebrating the traditions of ${destination}.`,
        rating: 4.1,
        isMock: true
      }
    ];
    
    return attractionsByCity[destination.toLowerCase()] || defaultAttractions;
  }

  _generateHostels(destination, budget) {
    const priceByBudget = {
      'cheap': { min: 500, max: 1500 },
      'moderate': { min: 2000, max: 4500 },
      'luxury': { min: 5000, max: 15000 }
    };
    
    const priceRange = priceByBudget[budget] || priceByBudget.moderate;
    
    return [
      {
        name: `${destination} Grand Hotel`,
        rating: 4.5,
        price: Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min),
        currency: '₹',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isMock: true
      },
      {
        name: `${destination} Comfort Stay`,
        rating: 4.2,
        price: Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min),
        currency: '₹',
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isMock: true
      },
      {
        name: `${destination} Heritage Inn`,
        rating: 4.7,
        price: Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min),
        currency: '₹',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isMock: true
      }
    ];
  }

  _generateWeather(destination) {
    // Mock weather based on common Indian climate patterns
    const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    // Temperature ranges by season (rough approximations)
    let temperature;
    const month = new Date().getMonth();
    
    // Winter (November to February)
    if (month >= 10 || month <= 1) {
      temperature = Math.floor(Math.random() * 15) + 10; // 10-25°C
    } 
    // Summer (March to June)
    else if (month >= 2 && month <= 5) {
      temperature = Math.floor(Math.random() * 15) + 25; // 25-40°C
    }
    // Monsoon/Post-Monsoon (July to October) 
    else {
      temperature = Math.floor(Math.random() * 10) + 20; // 20-30°C
    }
    
    return {
      temperature,
      condition: randomCondition,
      icon: this._getWeatherIcon(randomCondition),
      isMock: true
    };
  }
  
  _getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'sun';
      case 'partly cloudy': return 'cloud';
      case 'cloudy': return 'cloud';
      case 'rainy': return 'cloud-rain';
      case 'clear': return 'sun';
      default: return 'sun';
    }
  }
}

const itineraryService = new ItineraryService();
