# DataSculpt - AI-Powered Analytics Dashboard

DataSculpt is a modern, AI-powered analytics dashboard that transforms raw data into actionable insights. Built with React, TypeScript, and Tailwind CSS, it features real-time data visualization, AI-powered query generation using AWS Bedrock, and secure authentication with Clerk.

## 🚀 Features

### Core Features
- **AI-Powered Analytics**: Natural language query processing with AWS Bedrock
- **Real-time Data Visualization**: Interactive charts and graphs using Recharts
- **Secure Authentication**: User management with Clerk
- **Export Functionality**: Download reports as PDF or CSV
- **Responsive Design**: Modern UI with Tailwind CSS
- **Modular Architecture**: Clean, maintainable codebase

### Technical Features
- **SQL Query Verification**: Backend verification before PostgreSQL execution
- **API Integration**: Axios-based API client with error handling
- **Type Safety**: Full TypeScript implementation
- **Component Modularity**: Reusable chart and UI components
- **Error Handling**: Comprehensive error states and fallbacks

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Router** for navigation

### Authentication & Backend
- **Clerk** for user authentication
- **Axios** for API communication
- **AWS Bedrock** for AI-powered SQL generation

### Development Tools
- **Vite** for build tooling
- **ESLint** for code linting
- **TypeScript** for type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd datasculpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
   
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_BEDROCK_API_URL=https://bedrock-runtime.us-east-1.amazonaws.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Clerk Setup
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key to the environment variables
4. Configure your authentication settings in the Clerk dashboard

### API Backend Setup
The application expects a backend API with the following endpoints:
- `GET /api/dashboard/data` - Fetch dashboard data
- `POST /api/bedrock/generate-sql` - Generate SQL from natural language
- `POST /api/sql/verify-and-execute` - Verify and execute SQL queries
- `POST /api/export/pdf` - Export data as PDF
- `POST /api/export/csv` - Export data as CSV

### AWS Bedrock Setup
1. Configure AWS credentials
2. Set up Bedrock access for your account
3. Configure the Bedrock API endpoint in environment variables

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/
│   │   └── AIAssistant.tsx          # AI chat interface
│   ├── auth/
│   │   └── AuthForm.tsx             # Authentication forms
│   ├── charts/
│   │   └── ChartContainer.tsx       # Reusable chart component
│   └── dashboard/
│       ├── Dashboard.tsx            # Main dashboard
│       ├── DashboardHeader.tsx      # Header with user profile
│       ├── Sidebar.tsx              # Navigation sidebar
│       └── StatCard.tsx             # Statistics cards
├── contexts/
│   └── AuthContext.tsx              # Authentication context
├── lib/
│   ├── api.ts                       # API client and types
│   └── mockData.ts                  # Mock data for development
└── App.tsx                          # Main application component
```

## 🎨 UI Components

### ChartContainer
A modular chart component that supports:
- Bar charts
- Line charts
- Area charts
- Pie charts
- Export functionality (PDF/CSV)

### AIAssistant
AI-powered chat interface featuring:
- Natural language query processing
- SQL query generation
- Query execution and results display
- Real-time conversation flow

### DashboardHeader
Modern header with:
- User profile management
- Notifications
- Search functionality
- Responsive design

## 🔒 Security Features

- **Clerk Authentication**: Secure user management
- **JWT Token Handling**: Automatic token management
- **API Security**: Protected routes with authentication
- **SQL Injection Prevention**: Backend query verification

## 📊 Data Visualization

The application supports various chart types:
- **Revenue Analysis**: Bar and pie charts
- **Product Performance**: Time series and comparison charts
- **Geographic Distribution**: State-wise revenue breakdown
- **Trend Analysis**: Line charts for temporal data

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL`
- `VITE_BEDROCK_API_URL`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates and Roadmap

### Planned Features
- [ ] Real-time data streaming
- [ ] Advanced filtering options
- [ ] Custom dashboard layouts
- [ ] Multi-language support
- [ ] Mobile app version

### Recent Updates
- ✅ Modular component architecture
- ✅ Clerk authentication integration
- ✅ AWS Bedrock AI integration
- ✅ Export functionality
- ✅ Improved UI/UX design 