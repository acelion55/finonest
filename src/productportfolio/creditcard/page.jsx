import React, { useState, useEffect } from 'react';
import { Search, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import Nav from "../../components/navbar"
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreditCardsListing = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch credit cards from API
  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/creditcards/all`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch credit cards');
        }
        
        const data = await response.json();
        if (data.success) {
          setCardData(data.data);
        } else {
          setError('Failed to load credit cards');
        }
      } catch (err) {
        console.error('Error fetching credit cards:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditCards();
  }, []);

  // Search Logic
  const filteredCards = cardData.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
     <>
     <Nav/>
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by bank or card name..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
           
        </div>

        {/* Loading State */}
        {loading && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-400">Loading credit cards...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-red-200">
            <p className="text-red-400">Error: {error}</p>
            <p className="text-slate-400 text-sm mt-2">Make sure the server is running on http://localhost:5000</p>
          </div>
        )}

        {/* Card Grid using .map() */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <div 
                  key={card.id} 
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 md:p-8 flex flex-col sm:flex-row gap-6 group"
                >
                  {/* Card Visual */}
                  <div className="w-full sm:w-1/3 flex items-center justify-center">
                      
                    <img src={card.image} alt={card.name} className="relative w-28 h-44 rounded-xl shadow-lg transition-transform group-hover:rotate-2 group-hover:scale-105 overflow-hidden"/>
                     
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <CreditCard size={12} className="text-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-tight">
                        {card.bank}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 leading-tight">
                      {card.name}
                    </h3>

                    <ul className="space-y-2">
                      {card.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-[11px] md:text-xs text-slate-500 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                     <Link to={`/productportfolio/creditcard/creditapply/${card.id}`}>
                    <button className="w-full mt-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                      Apply Now <ChevronRight size={16} />
                    </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                 <p className="text-slate-400">No cards found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CreditCardsListing;