const productList = () => {
	return {
		products: [],
		loading: true,
		error: null,
		async init() {
			try {
				const response = await fetch(
					"https://68956221039a1a2b288f0c5b.mockapi.io/api/v1/products"
				);
				if (!response.ok) {
					throw new Error(`HTTP Error! status: ${response.status}`);
				}

				this.products = await response.json();
			} catch (err) {
				this.error = err;
				console.log("Error fetching products:", err);
			} finally {
				this.loading = false;
			}
		},
	};
};

const productDetail = () => {
	return {
		product: null,
		loading: true,
		error: null,
		currentImage: '',
		async init() {
			// Get product ID from URL
			const urlParams = new URLSearchParams(window.location.search);
			const productId = urlParams.get('id');
			
			if (!productId) {
				this.error = 'No product ID provided';
				this.loading = false;
				return;
			}
			
			try {
				const response = await fetch(
					`https://68956221039a1a2b288f0c5b.mockapi.io/api/v1/products/${productId}`
				);
				
				if (!response.ok) {
					throw new Error(`Product not found`);
				}
				
				this.product = await response.json();
				this.currentImage = this.product.images?.[0] || '';
			} catch (err) {
				this.error = err.message || 'Error loading product';
				console.error("Error fetching product:", err);
			} finally {
				this.loading = false;
			}
		},
	};
};
