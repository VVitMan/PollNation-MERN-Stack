# Poll Nation Web Application

Poll Nation is an interactive platform that allows users to create, share, and participate in quizzes and polls. Designed to enhance community interaction and learning, the platform provides tools for educators, content creators, and casual users.

## Features

- **Create Quizzes and Polls**: Users can easily create interactive quizzes and polls with customizable options.
- **User Profiles**: Each user has a profile where they can manage their created content and interact with others.
- **Category-based Discovery**: Explore quizzes and polls by category to find topics of interest in profile page.
- **Commenting System**: Engage with other users through comments on quizzes and polls.
- **Voting and Feedback**: View results for polls and receive feedback on quiz answers.
- **Admin Tools**: Monitor user report, ban user and delete user account.
- **User Reporting**: Users can report inappropriate behavior or content from others in profile page.
- **Admin Dashboard**:
   - View reports received by users.
   - Take action by banning users, unban users and delete user account.

## Technologies Used

- **Frontend**: React.js for a responsive and dynamic user interface.
- **Backend**: Node.js with Express.js for handling API requests.
- **Database**: MongoDB for scalable and flexible data management.
- **Authentication**: Secure login and registration with role-based access control.
- **Deployment**: Designed for scalability and future integration with CI/CD workflows.

## Project Goals

1. To provide a user-friendly platform for quizzes and polls as primary content.
2. To foster educational engagement and community interaction.
3. To target a wide audience, aiming for 500-1,000 users in the first three months.

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.
- MongoDB Atlas account or local MongoDB setup.
- Git for version control.
- Firebase Authentication for Google Authentication
- Firebase Storage for store the user's image

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VVitMan/PollNation-MERN-Stack.git
2. Navigate to the project directory:
   ```bash
   cd PollNation-MERN-Stack
3. Install dependencies for both the frontend and backend:
   ```bash
   npm install
4. Set up environment variables:
   - Create a .env file in the backend directory.
   - Add the following keys:
     ```bash
     MONGO_URI=<Your MongoDB URI>
     JWT_SECRET=<Your JWT Secret>
     PORT=5000
   - Create a .env file in the frontend directory.
   - Add the following keys:
     ```bash
     VITE_FIREBASE_API_KEY=<Your Firebase API Key>

### Running the Application
1. Start the backend server:
   ```bash
   npm run dev
2. Start the React frontend:
   ```bash
   cd frontend
   npm run dev

## Future Plans
- Implement CI/CD workflows using GitHub Actions.
- Enhance analytics features for user engagement tracking.
- Develop a mobile-friendly version of the platform.

## License
This project is licensed under the MIT License.

## Contact
- Developers:
   - Mr. Itthikon Amonkhana
   - Mr. Tarnakit Pornvoravanij
- University: Srinakharinwirot University, Bangkok, Thailand
- Repository: https://github.com/VVitMan/PollNation-MERN-Stack.git
