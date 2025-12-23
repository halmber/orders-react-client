# Orders Management System

A React-based web application for managing customer orders with filtering, pagination, and real-time updates.

## Key Features

### Core Functionality

- **Order Management**: Create, read, update, and delete customer orders
- **Filtering**: Filter orders by status, payment method, and customer email
- **Pagination**: Navigate through large datasets efficiently
- **Real-time Validation**: Form validation using Formik and Yup
- **Internationalization**: Multi-language support (English/Ukrainian) with react-intl
- **Responsive Design**: Mobile-first approach with adaptive layouts

### User Experience

- **Snackbar Notifications**: Toast notifications for all user actions
- **Optimistic UI Updates**: Immediate feedback on user interactions
- **Loading States**: Clear indicators for async operations
- **Error Handling**: Graceful quality improvement with mock data fallback
- **URL State Sync**: Filters and pagination persist in URL for shareable links

## Architecture Highlights

### Redux State Management

The application uses Redux for centralized state management with a well-structured pattern:

```
state/
├── user/      - Authentication and user data
├── orders/    - Orders list, filters, pagination
└── snackbar/  - Global notification system
```

**Notable Pattern**: The `SnackbarReduxBridge` component bridges Redux actions with the React Context-based snackbar system, allowing notifications from async Redux thunks without prop drilling.

### Component Architecture

#### Container/Presenter Pattern

- **Page Providers** (`pageProviders/`): Connect state or another functionality to page components
- **Page Components** (`pages/`): Pure presentational components
- **Reusable Components** (`components/`): Generic UI components

#### Modular Internationalization

Each page module includes its own i18n messages, promoting modularity and code splitting:

```
pages/orders/
├── containers/
├── intl/
│   ├── messages.json
│   └── messages.ua.json
└── index.jsx
```

### Validation Schema Factory

A dynamic validation schema generator creates Yup schemas from configuration objects:

```javascript
const fieldsConfig = {
  amount: {
    type: 'number',
    required: true,
    min: 0.01,
    positive: true,
    labelKey: 'orderDetails.field.amount',
  },
};

const schema = createValidationSchema(fieldsConfig, formatMessage);
```

**Benefits**:

- DRY principle
- Centralized validation logic
- Automatic i18n integration
- Type-safe field definitions

### Error Handling with Mock Fallback

The application implements a sophisticated error handling strategy:

```javascript
async function fetchData() {
  try {
    return await apiCall();
  } catch (apiError) {
    try {
      return await mockDataFallback();
    } catch (mockError) {
      throw mockError;
    }
  }
}
```

This ensures the application remains functional even when the backend is unavailable, making it ideal for:

- Development environments
- Demo scenarios
- Offline functionality testing

### Custom Hooks

Reusable hooks abstract common patterns:

- `useChangePage`: Unified navigation with state preservation
- `useLocationSearch`: Parse URL search params
- `useSnackbar`: Access global notification system
- `useTheme`: Dynamic theming support

## Technology Stack

- **React 18**: UI framework
- **Redux**: State management
- **React Router v6**: Client-side routing
- **Formik + Yup**: Form handling and validation
- **react-intl**: Internationalization
- **react-jss**: CSS-in-JS styling
- **Axios**: HTTP client

## Project Structure

```
src/
├── app/                    # Application-level code
│   ├── actions/            # Redux actions
│   ├── constants/          # Global constants
│   ├── components/         # App-specific components
│   └── reducers/           # Redux reducers
├── components/             # Reusable UI components
├── pages/                  # Page-specific components
├── pageProviders/          # Intl connected containers
├── misc/                   # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── providers/          # Context providers
│   └── validation/         # Validation utilities
└── constants/              # Application constants
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Configuration

Environment variables are managed through `src/config/index.js`:

```javascript
const config = {
  UI_URL_PREFIX: '/app',
  ORDERS_SERVICE: 'http://api.example.com',
};
```

## Contributing

1. Follow the established architecture patterns
2. Update i18n messages in both languages
3. Ensure responsive design across breakpoints
4. Document complex logic with inline comments

## License

MIT License - feel free to use this project as a reference or starting point for your own applications.
