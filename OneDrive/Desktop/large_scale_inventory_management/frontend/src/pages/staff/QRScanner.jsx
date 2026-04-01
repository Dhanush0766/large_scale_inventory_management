import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiCamera, FiX } from 'react-icons/fi';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const startScanning = () => {
    setScanning(true);
    setProduct(null);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        qrbox: { width: 250, height: 250 },
        fps: 10,
      });

      scanner.render(
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.id) {
              const res = await productsAPI.getById(data.id);
              setProduct(res.data);
              toast.success('Product found!');
            }
          } catch (error) {
            // Try as plain product ID
            try {
              const res = await productsAPI.getById(decodedText);
              setProduct(res.data);
              toast.success('Product found!');
            } catch (e) {
              toast.error('Product not found');
            }
          }
          scanner.clear().catch(() => {});
          setScanning(false);
        },
        (error) => {
          // Scan error — ignored during continuous scanning
        }
      );

      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }
    setScanning(false);
  };

  return (
    <div className="page-container">
      <div className="qr-scanner-page">
        <div className="scanner-section">
          {!scanning ? (
            <div className="scanner-placeholder">
              <div className="placeholder-icon">📷</div>
              <h3>QR Code Scanner</h3>
              <p>Scan a product QR code to view its details</p>
              <button className="btn btn-primary btn-lg" onClick={startScanning}>
                <FiCamera /> Start Scanner
              </button>
            </div>
          ) : (
            <div className="scanner-active">
              <div id="qr-reader" style={{ width: '100%' }}></div>
              <button className="btn btn-danger" onClick={stopScanning} style={{ marginTop: '1rem' }}>
                <FiX /> Stop Scanner
              </button>
            </div>
          )}
        </div>

        {product && (
          <div className="product-detail-card">
            <h3>Product Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name</label>
                <span>{product.name}</span>
              </div>
              <div className="detail-item">
                <label>SKU</label>
                <span><code>{product.sku}</code></span>
              </div>
              <div className="detail-item">
                <label>Category</label>
                <span>{product.category}</span>
              </div>
              <div className="detail-item">
                <label>Price</label>
                <span className="font-bold">${Number(product.price).toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <label>Quantity in Stock</label>
                <span className={product.quantity <= product.min_stock_level ? 'text-danger font-bold' : 'font-bold'}>
                  {product.quantity}
                </span>
              </div>
              <div className="detail-item">
                <label>Min Stock Level</label>
                <span>{product.min_stock_level}</span>
              </div>
              <div className="detail-item">
                <label>Supplier</label>
                <span>{product.supplier_name || '—'}</span>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <span className={`badge ${product.quantity === 0 ? 'badge-danger' : product.quantity <= product.min_stock_level ? 'badge-warning' : 'badge-success'}`}>
                  {product.quantity === 0 ? 'Out of Stock' : product.quantity <= product.min_stock_level ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>
            {product.description && (
              <div className="detail-description">
                <label>Description</label>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
