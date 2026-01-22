import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productService from "../api/productService";

// Async thunk actions
export const fetchProducts = createAsyncThunk("product/fetchAll", async (businessId, { rejectWithValue }) => {
  try {
    const data = await productService.fetchProductsByBusiness(businessId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
  }
});

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async ({ businessId, productId }, { rejectWithValue }) => {
    try {
      const data = await productService.fetchProductById(businessId, productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  },
);

export const createNewProduct = createAsyncThunk(
  "product/create",
  async ({ businessId, productData }, { rejectWithValue }) => {
    try {
      const data = await productService.createProduct(businessId, productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  },
);

export const updateExistingProduct = createAsyncThunk(
  "product/update",
  async ({ businessId, productId, productData }, { rejectWithValue }) => {
    try {
      const data = await productService.updateProduct(businessId, productId, productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  },
);

export const removeProduct = createAsyncThunk(
  "product/delete",
  async ({ businessId, productId }, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(businessId, productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  },
);

export const softRemoveProduct = createAsyncThunk(
  "product/softDelete",
  async ({ businessId, productId }, { rejectWithValue }) => {
    try {
      const data = await productService.softDeleteProduct(businessId, productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to soft delete product");
    }
  },
);

export const restockProductStock = createAsyncThunk(
  "product/restock",
  async ({ businessId, productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await productService.restockProduct(businessId, productId, quantity);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to restock product");
    }
  },
);

export const deductStock = createAsyncThunk(
  "product/deductStock",
  async ({ businessId, productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await productService.deductProductStock(businessId, productId, quantity);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to deduct stock");
    }
  },
);

export const toggleStatus = createAsyncThunk(
  "product/toggleStatus",
  async ({ businessId, productId }, { rejectWithValue }) => {
    try {
      const data = await productService.toggleProductStatus(businessId, productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle status");
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Manually select a product
    selectProduct(state, action) {
      state.selectedProduct = action.payload;
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create product
    builder
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update product
    builder
      .addCase(updateExistingProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExistingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete product (permanent)
    builder
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
        state.error = null;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Soft delete product
    builder
      .addCase(softRemoveProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softRemoveProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(softRemoveProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Restock product
    builder
      .addCase(restockProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restockProductStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index].stock = action.payload.stock;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct.stock = action.payload.stock;
        }
        state.error = null;
      })
      .addCase(restockProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Deduct stock
    builder
      .addCase(deductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deductStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index].stock = action.payload.stock;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct.stock = action.payload.stock;
        }
        state.error = null;
      })
      .addCase(deductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle status
    builder
      .addCase(toggleStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index].isActive = action.payload.isActive;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct.isActive = action.payload.isActive;
        }
        state.error = null;
      })
      .addCase(toggleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectProduct, clearError } = productSlice.actions;

export default productSlice.reducer;
