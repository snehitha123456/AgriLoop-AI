
import { useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const demoProducts = [
  { id: 1, name: 'Tomato', category: 'Vegetables', pricePerKg: 28, quantityKg: 120, farmerName: 'Ravi Kumar', location: 'Village Market' },
  { id: 2, name: 'Onion', category: 'Vegetables', pricePerKg: 32, quantityKg: 90, farmerName: 'Lakshmi Devi', location: 'Greenfield Village' },
  { id: 3, name: 'Potato', category: 'Vegetables', pricePerKg: 25, quantityKg: 100, farmerName: 'Ramesh', location: 'Village Market' },
  { id: 4, name: 'Carrot', category: 'Vegetables', pricePerKg: 40, quantityKg: 50, farmerName: 'Anitha', location: 'Sunrise Village' },
  { id: 5, name: 'Spinach', category: 'Vegetables', pricePerKg: 18, quantityKg: 45, farmerName: 'Anitha', location: 'Sunrise Village' },
  { id: 6, name: 'Cabbage', category: 'Vegetables', pricePerKg: 30, quantityKg: 60, farmerName: 'Ravi Kumar', location: 'Village Market' },
  { id: 7, name: 'Cauliflower', category: 'Vegetables', pricePerKg: 35, quantityKg: 40, farmerName: 'Lakshmi Devi', location: 'Greenfield Village' },
  { id: 8, name: 'Green Chilli', category: 'Vegetables', pricePerKg: 50, quantityKg: 20, farmerName: 'Suresh', location: 'Riverbank Village' },
  { id: 9, name: 'Cucumber', category: 'Vegetables', pricePerKg: 25, quantityKg: 35, farmerName: 'Ramesh', location: 'Village Market' },
  { id: 10, name: 'Brinjal', category: 'Vegetables', pricePerKg: 32, quantityKg: 30, farmerName: 'Anitha', location: 'Sunrise Village' },
  { id: 11, name: 'Mango', category: 'Fruits', pricePerKg: 65, quantityKg: 75, farmerName: 'Suresh', location: 'Riverbank Village' },
  { id: 12, name: 'Banana', category: 'Fruits', pricePerKg: 40, quantityKg: 80, farmerName: 'Ravi Kumar', location: 'Village Market' },
  { id: 13, name: 'Apple', category: 'Fruits', pricePerKg: 120, quantityKg: 25, farmerName: 'Lakshmi Devi', location: 'Greenfield Village' },
  { id: 14, name: 'Orange', category: 'Fruits', pricePerKg: 60, quantityKg: 40, farmerName: 'Suresh', location: 'Riverbank Village' },
  { id: 15, name: 'Papaya', category: 'Fruits', pricePerKg: 35, quantityKg: 30, farmerName: 'Ramesh', location: 'Village Market' },
  { id: 16, name: 'Guava', category: 'Fruits', pricePerKg: 45, quantityKg: 35, farmerName: 'Anitha', location: 'Sunrise Village' },
  { id: 17, name: 'Watermelon', category: 'Fruits', pricePerKg: 25, quantityKg: 90, farmerName: 'Ravi Kumar', location: 'Village Market' },
];

const productImages = {
  tomato: '🍅',
  onion: '🧅',
  mango: '🥭',
  spinach: '🥬',
  potato: '🥔',
  carrot: '🥕',
  cabbage: '🥬',
  cauliflower: '🥦',
  'green chilli': '🌶️',
  cucumber: '🥒',
  pumpkin: '🎃',
  banana: '🍌',
  apple: '🍎',
  orange: '🍊',
  papaya: '🍈',
  guava: '🍐',
  watermelon: '🍉',
  rice: '🌾',
  wheat: '🌾',
  groundnut: '🥜',
  milk: '🥛',
  curd: '🥣',
  brinjal: '🍆',
};

function getProductImage(name = '') {
  return productImages[name.trim().toLowerCase()] || '🌱';
}

function getPrice(product) {
  return Number(product.pricePerKg ?? product.price_per_kg ?? 0);
}

function getQuantity(product) {
  return Number(product.quantityKg ?? product.quantity_kg ?? 0);
}

export default function App() {
  const [products, setProducts] = useState(demoProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [buyer, setBuyer] = useState('');
  const [notice, setNotice] = useState('');
  const [apiStatus, setApiStatus] = useState('Demo data');

  useEffect(() => {
    let active = true;

    fetch(`${API}/products`)
      .then(response => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then(data => {
        if (!active) return;

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setApiStatus('Connected to Spring Boot');
        } else {
          setProducts(demoProducts);
          setApiStatus('Demo data');
        }
      })
      .catch(() => {
        if (!active) return;
        setProducts(demoProducts);
        setApiStatus('Demo data — backend unavailable');
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter(product => {
      const name = String(product.name || '').toLowerCase();
      const productCategory = String(product.category || '').toLowerCase();

      return (
        (category === 'All' ||
          productCategory === category.toLowerCase()) &&
        name.includes(query)
      );
    });
  }, [products, search, category]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  }

  function addToCart(product) {
    setCart(old => {
      const found = old.find(item => item.id === product.id);

      return found
        ? old.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...old, { ...product, quantity: 1 }];
    });

    showNotice(`${product.name} added to your basket`);
  }

  function changeQuantity(id, change) {
    setCart(old =>
      old
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce(
    (sum, item) => sum + getPrice(item) * item.quantity,
    0
  );

  async function placeOrder() {
    if (!buyer.trim() || cart.length === 0) {
      showNotice('Enter your name and add at least one product.');
      return;
    }

    if (apiStatus !== 'Connected to Spring Boot') {
      showNotice('Demo checkout only. Start the backend to save orders.');
      return;
    }

    try {
      for (const item of cart) {
        const response = await fetch(`${API}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerName: buyer.trim(),
            productId: item.id,
            quantityKg: item.quantity,
            totalPrice: getPrice(item) * item.quantity,
          }),
        });

        if (!response.ok) {
          throw new Error('Order request failed');
        }
      }

      setCart([]);
      setBuyer('');
      showNotice('Order placed successfully!');
    } catch {
      showNotice('Could not save the order. Check the backend API.');
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-icon">🌾</span>
          <span>
            AgriLoop<span className="brand-ai"> AI</span>
            <small>Farm to market, smarter.</small>
          </span>
        </a>

        <div className="status">
          <i />
          {apiStatus}
        </div>

        <a className="cart-jump" href="#order">
          My order <b>{cartCount}</b>
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">A SMARTER AGRICULTURE NETWORK</span>

            <h1>
              Fresh harvests.
              <br />
              <em>Fairer markets.</em>
            </h1>

            <p>
              Connect directly with local farmers, discover fresh produce,
              and help reduce food waste through smarter supply chains.
            </p>

            <a className="primary" href="#market">
              Explore produce <span>↘</span>
            </a>

            <div className="hero-stats">
              <div>
                <b>Farm first</b>
                <small>Local growers</small>
              </div>
              <div>
                <b>Less waste</b>
                <small>Smarter stock</small>
              </div>
              <div>
                <b>Clear pricing</b>
                <small>Market access</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="sun" />
            <div className="field field-back" />
            <div className="field field-front" />

            <div className="produce-card">
              <span>🌿</span>
              <div>
                <b>Harvest of the day</b>
                <small>Fresh from nearby farms</small>
              </div>
              <strong>↗</strong>
            </div>

            <div className="floating-note">
              🌱
              <span>
                <b>Grow local</b>
                <small>Support farmers</small>
              </span>
            </div>
          </div>
        </section>

        <section className="intro" id="market">
          <div>
            <span className="eyebrow">THE LOCAL MARKET</span>
            <h2>Today's fresh picks</h2>
            <p>Browse produce listed by farmers and local growers.</p>
          </div>

          <label className="search">
            ⌕
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search produce..."
            />
          </label>
        </section>

        <div className="filters">
          {['All', 'Vegetables', 'Fruits'].map(item => (
            <button
              key={item}
              className={category === item ? 'selected' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="product-grid">
          {filtered.map((product, index) => (
            <article className="product" key={product.id}>
              <div className={`product-art art-${index % 4}`}>
                <span className="product-emoji">
                  {getProductImage(product.name)}
                </span>
                <small>{product.category}</small>
              </div>

              <div className="product-info">
                <div className="product-title">
                  <h3>{product.name}</h3>
                  <span>Fresh</span>
                </div>

                <p>
                  👨‍🌾{' '}
                  {product.farmerName ||
                    product.farmer_name ||
                    'Local farmer'}
                </p>

                <p>📍 {product.location || 'Nearby village'}</p>

                <div className="product-foot">
                  <div>
                    <b>₹{getPrice(product)}</b>
                    <small>
                      per kg · {getQuantity(product)} kg available
                    </small>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name}`}
                  >
                    ＋
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="empty">
            No produce found. Try another search.
          </div>
        )}

        <section className="impact">
          <div className="impact-icon">♻</div>

          <div>
            <span className="eyebrow">BETTER FOR EVERYONE</span>
            <h2>Every harvest deserves a market.</h2>
            <p>
              AgriLoop is designed to help local growers reach more buyers
              while making surplus produce easier to manage.
            </p>
          </div>

          <div className="impact-number">
            <b>01</b>
            <small>Start with local produce</small>
            <b>02</b>
            <small>Connect the supply chain</small>
            <b>03</b>
            <small>Reduce avoidable waste</small>
          </div>
        </section>

        <section className="order-section" id="order">
          <div>
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <h2>Your produce basket</h2>
            <p>Review your items before placing a demo order.</p>
          </div>

          {cart.length === 0 ? (
            <div className="empty basket-empty">
              Your basket is empty. Add produce from the market above.
            </div>
          ) : (
            <div className="basket">
              {cart.map(product => (
                <div className="basket-row" key={product.id}>
                  <span>
                    {product.name} <small>× {product.quantity} kg</small>
                  </span>

                  <b>₹{(getPrice(product) * product.quantity).toFixed(2)}</b>

                  <div className="quantity-controls">
                    <button
                      onClick={() => changeQuantity(product.id, -1)}
                      aria-label={`Decrease ${product.name}`}
                    >
                      −
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => changeQuantity(product.id, 1)}
                      aria-label={`Increase ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="basket-total">
                <span>Estimated total</span>
                <b>₹{total.toFixed(2)}</b>
              </div>

              <label className="buyer-label">
                Buyer name
                <input
                  value={buyer}
                  onChange={event => setBuyer(event.target.value)}
                  placeholder="Enter your name"
                />
              </label>

              <button className="primary checkout" onClick={placeOrder}>
                Place demo order ↗
              </button>
            </div>
          )}
        </section>
      </main>

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}

      <footer>
        <a className="brand" href="#">
          🌾 AgriLoop<span className="brand-ai"> AI</span>
        </a>
        <p>
          Built for a more connected, less wasteful agriculture supply chain.
        </p>
        <small>
          College project prototype · Not a live commerce service
        </small>
      </footer>
    </div>
  );
}
