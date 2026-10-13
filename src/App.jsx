
import { useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const demoProducts = [
  { id: 1, name: 'Tomato', category: 'Vegetables', pricePerKg: 28, quantityKg: 120, farmerName: 'Ravi Kumar', location: 'Village Market' },
  { id: 2, name: 'Onion', category: 'Vegetables', pricePerKg: 32, quantityKg: 90, farmerName: 'Lakshmi Devi', location: 'Greenfield Village' },
  { id: 3, name: 'Mango', category: 'Fruits', pricePerKg: 65, quantityKg: 75, farmerName: 'Suresh', location: 'Riverbank Village' },
  { id: 4, name: 'Spinach', category: 'Vegetables', pricePerKg: 18, quantityKg: 45, farmerName: 'Anitha', location: 'Sunrise Village' },
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

export default function App() {
  const [products, setProducts] = useState(demoProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [buyer, setBuyer] = useState('');
  const [notice, setNotice] = useState('');
  const [apiStatus, setApiStatus] = useState('Demo data');

  useEffect(() => {
    fetch(`${API}/products`)
      .then(response => {
        if (!response.ok) {
          throw new Error('API unavailable');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setApiStatus('Connected to Spring Boot');
      })
      .catch(() => {
        setApiStatus('Demo data — start backend to load MySQL products');
      });
  }, []);

  const filtered = useMemo(
    () =>
      products.filter(product =>
        (category === 'All' ||
          product.category?.toLowerCase() === category.toLowerCase()) &&
        product.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search, category]
  );

  const addToCart = product => {
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

    setNotice(`${product.name} added to order`);
    setTimeout(() => setNotice(''), 2200);
  };

  const total = cart.reduce(
    (sum, product) =>
      sum +
      Number(product.pricePerKg ?? product.price_per_kg) *
        product.quantity,
    0
  );

  async function placeOrder() {
    if (!buyer.trim() || cart.length === 0) {
      setNotice('Enter your name and add at least one product.');
      setTimeout(() => setNotice(''), 3500);
      return;
    }

    try {
      for (const item of cart) {
        const response = await fetch(`${API}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerName: buyer,
            productId: item.id,
            quantityKg: item.quantity,
            totalPrice:
              Number(item.pricePerKg ?? item.price_per_kg) *
              item.quantity,
          }),
        });

        if (!response.ok) {
          throw new Error('Order API failed');
        }
      }

      setNotice('Order placed successfully!');
      setCart([]);
      setBuyer('');
    } catch {
      setNotice(
        'Demo checkout only: start Spring Boot and MySQL to save orders.'
      );
    }

    setTimeout(() => setNotice(''), 3500);
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
          My order <b>{cart.reduce((sum, item) => sum + item.quantity, 0)}</b>
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

                <p>
                  📍 {product.location || 'Nearby village'}
                </p>

                <div className="product-foot">
                  <div>
                    <b>
                      ₹
                      {product.pricePerKg ??
                        product.price_per_kg}
                    </b>
                    <small>
                      per kg ·{' '}
                      {product.quantityKg ??
                        product.quantity_kg}{' '}
                      kg available
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
                    {product.name}{' '}
                    <small>× {product.quantity} kg</small>
                  </span>

                  <b>
                    ₹
                    {(
                      Number(
                        product.pricePerKg ??
                          product.price_per_kg
                      ) * product.quantity
                    ).toFixed(2)}
                  </b>

                  <button
                    onClick={() =>
                      setCart(old =>
                        old.filter(item => item.id !== product.id)
                      )
                    }
                  >
                    Remove
                  </button>
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

              <button
                className="primary checkout"
                onClick={placeOrder}
              >
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