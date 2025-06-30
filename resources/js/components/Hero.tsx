import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Typed from 'typed.js';

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularTags, setPopularTags] = useState<Array<{name: string; count: number; display: string}>>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const navigate = useNavigate();
  const typedElementRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);

  useEffect(() => {
    if (typedElementRef.current) {
      typedInstance.current = new Typed(typedElementRef.current, {
        strings: [
          `<span class="syntax-keyword">const</span> <span class="syntax-function">findDeveloperEvents</span> <span class="syntax-keyword">=</span> <span class="syntax-bracket">(</span><span class="syntax-param">location</span><span class="syntax-bracket">) =></span> <span class="syntax-bracket">{</span><br>&nbsp;&nbsp;<span class="syntax-keyword">return</span> <span class="syntax-return">events</span><span class="syntax-bracket">.</span><span class="syntax-function">nearYou</span><span class="syntax-bracket">();</span><br><span class="syntax-bracket">};</span>`
        ],
        typeSpeed: 50,
        backSpeed: 30,
        startDelay: 500,
        showCursor: true,
        cursorChar: '|',
        loop: false,
        contentType: 'html',
        onComplete: () => {
          // Keep the cursor blinking after completion
          if (typedInstance.current?.cursor) {
            typedInstance.current.cursor.style.animation = 'blink 1s infinite';
          }
        }
      });
    }

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const tags = await api.getPopularTags();
        setPopularTags(tags);
      } catch (error) {
        console.error('Failed to fetch popular tags:', error);
        // Fallback to some default tags if API fails
        setPopularTags([
          { name: 'JavaScript', count: 0, display: 'JavaScript (0)' },
          { name: 'Python', count: 0, display: 'Python (0)' },
          { name: 'React', count: 0, display: 'React (0)' },
        ]);
      } finally {
        setTagsLoading(false);
      }
    };

    fetchPopularTags();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTagClick = (tag: string) => {
    // Extract just the technology name from the tag (remove count)
    const tagName = tag.split(' (')[0];
    navigate(`/events?tag=${encodeURIComponent(tagName)}`);
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div style={{ position: 'relative' }}>
            {/* Invisible placeholder to reserve exact space */}
            <h1 style={{
              visibility: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              lineHeight: '1.5',
              whiteSpace: 'pre-line',
              pointerEvents: 'none'
            }}>
              <span className="syntax-keyword">const</span>{' '}
              <span className="syntax-function">findDeveloperEvents</span>{' '}
              <span className="syntax-keyword">=</span>{' '}
              <span className="syntax-bracket">(</span>
              <span className="syntax-param">location</span>
              <span className="syntax-bracket">) =&gt;</span>{' '}
              <span className="syntax-bracket">{'{'}</span>
              <br />
              &nbsp;&nbsp;<span className="syntax-keyword">return</span>{' '}
              <span className="syntax-return">events</span>
              <span className="syntax-bracket">.</span>
              <span className="syntax-function">nearYou</span>
              <span className="syntax-bracket">();</span>
              <br />
              <span className="syntax-bracket">{'}'};</span>
            </h1>
            
            {/* Actual typed content */}
            <h1 style={{
              position: 'relative',
              lineHeight: '1.5',
              whiteSpace: 'pre-line'
            }}>
              <span ref={typedElementRef}></span>
            </h1>
          </div>
          
          <p>
            <span style={{ color: 'var(--accent-secondary)' }}>// </span>
            Discover conferences, meetups, hackathons, and workshops. Connect with the developer community, learn new technologies, and advance your career.
          </p>
          
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search events, technologies, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
          
          <div className="tags">
            {tagsLoading ? (
              // Loading state
              Array.from({ length: 6 }, (_, i) => (
                <span 
                  key={i} 
                  className="tag"
                  style={{ 
                    opacity: 0.5,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    cursor: 'default'
                  }}
                >
                  Loading...
                </span>
              ))
            ) : (
              popularTags.map((tag) => (
                <span 
                  key={tag.name} 
                  className="tag"
                  onClick={() => handleTagClick(tag.display)}
                  style={{ cursor: 'pointer' }}
                >
                  {tag.display}
                </span>
              ))
            )}
            <button 
              className="more-filters-btn"
              onClick={() => navigate('/events')}
            >
              More filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;