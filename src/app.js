// Global cart store
document.addEventListener("alpine:init", () => {
	Alpine.store("cart", {
		items: JSON.parse(localStorage.getItem("cart") || "[]"),

		init() {
			// Watch for changes and save to localStorage
			Alpine.effect(() => {
				localStorage.setItem("cart", JSON.stringify(this.items));
			});
		},

		get count() {
			return this.items.reduce((total, item) => total + item.quantity, 0);
		},
		get total() {
			return this.items
				.reduce((total, item) => total + item.price * item.quantity, 0)
				.toFixed(2);
		},
		addItem(product) {
			const existingItem = this.items.find((item) => item.id === product.id);

			if (existingItem) {
				existingItem.quantity++;
			} else {
				this.items.push({
					id: product.id,
					name: product.name,
					price: parseFloat(product.price),
					image: product.images?.[0] || "",
					quantity: 1,
				});
			}

			// Show notification
			this.showNotification(product.name);
		},
		clearCart() {
			this.items = [];
		},
		showNotification(productName) {
			// Create notification element
			const notification = document.createElement("div");
			notification.className =
				"fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-0 transition-all duration-300 z-50";
			notification.textContent = `${productName} added to cart!`;
			document.body.appendChild(notification);

			// Remove after 3 seconds
			setTimeout(() => {
				notification.style.transform = "translateY(100px)";
				notification.style.opacity = "0";
				setTimeout(() => notification.remove(), 300);
			}, 3000);
		},
	});
});

const productList = () => {
	return {
		products: [],
		allProducts: [],
		searchQuery: "",
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

				this.allProducts = await response.json();
				this.products = [...this.allProducts];
			} catch (err) {
				this.error = err;
				console.log("Error fetching products:", err);
			} finally {
				this.loading = false;
			}
		},
		searchProducts() {
			if (this.searchQuery.trim() === "") {
				this.products = [...this.allProducts];
			} else {
				const query = this.searchQuery.toLowerCase();
				this.products = this.allProducts.filter(
					(product) =>
						product.name.toLowerCase().includes(query) ||
						product.description.toLowerCase().includes(query) ||
						(product.category && product.category.toLowerCase().includes(query))
				);
			}
		},
	};
};

const productDetail = () => {
	return {
		product: null,
		loading: true,
		error: null,
		currentImage: "",
		async init() {
			// Get product ID from URL
			const urlParams = new URLSearchParams(window.location.search);
			const productId = urlParams.get("id");

			if (!productId) {
				this.error = "No product ID provided";
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
				this.currentImage = this.product.images?.[0] || "";
			} catch (err) {
				this.error = err.message || "Error loading product";
				console.error("Error fetching product:", err);
			} finally {
				this.loading = false;
			}
		},
	};
};
