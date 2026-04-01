import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiDownload, FiSearch } from 'react-icons/fi';

const QRCode = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrData, setQRData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async (product) => {
    try {
      setSelectedProduct(product);
      const res = await productsAPI.getQRCode(product.id);
      setQRData(res.data);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const downloadQR = () => {
    if (!qrData) return;
    const link = document.createElement('a');
    link.download = `QR_${qrData.product.sku}.png`;
    link.href = qrData.qrCode;
    link.click();
    toast.success('QR Code downloaded');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="qr-layout">
        <div className="qr-product-list">
          <div className="search-bar" style={{marginBottom: '1rem'}}>
            <FiSearch />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="product-list-scroll">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`product-list-item ${selectedProduct?.id === product.id ? 'active' : ''}`}
                onClick={() => generateQR(product)}
              >
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.sku}</small>
                </div>
                <span className="badge badge-info">${Number(product.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="qr-preview">
          {qrData ? (
            <div className="qr-card">
              <h3>QR Code</h3>
              <div className="qr-image">
                <img src={qrData.qrCode} alt={`QR Code for ${qrData.product.name}`} />
              </div>
              <div className="qr-details">
                <h4>{qrData.product.name}</h4>
                <p>SKU: <code>{qrData.product.sku}</code></p>
                <p>Price: <strong>${Number(qrData.product.price).toFixed(2)}</strong></p>
              </div>
              <button className="btn btn-primary" onClick={downloadQR}>
                <FiDownload /> Download QR Code
              </button>
            </div>
          ) : (
            <div className="qr-placeholder">
              <div className="placeholder-icon">📱</div>
              <h3>Select a Product</h3>
              <p>Choose a product from the list to generate its QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCode;
