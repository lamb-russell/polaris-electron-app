

# Polaris Electron App

## Overview

The **Polaris Electron App** provides a user-friendly graphical interface to interact with the [Polaris CLI](https://github.com/apache/polaris). The app allows you to manage catalogs, principals, and roles directly from a graphical interface, while internally leveraging the Polaris CLI for command execution.

## Features

- **Catalog Management**: Create, list, and delete catalogs.
- **Principal Management**: List and manage principals.
- **Role Management**: Manage roles and assign them to principals.
- **Configuration**: Easily configure CLI path, host, port, client ID, and client secret through the UI.

## Requirements

Before running the Polaris Electron App, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)
- The [Polaris CLI](https://github.com/apache/polaris) installed and accessible on your system

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/polaris-electron-app.git
   ```

2. Navigate to the app's directory:

   ```bash
   cd polaris-electron-app
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

### Running the App in Development Mode

To start the app in development mode:

1. Ensure your Polaris CLI path and configuration is properly set.
2. Start the Electron app:

   ```bash
   npm start
   ```

This will open the app in development mode and automatically launch the React development server.

### Building the App for Production

To build the app for production:

```bash
npm run build
```

This will create a production-ready build in the `build/` directory. You can then package the app using Electron Builder for various platforms:

```bash
npm run electron-pack
```

### Electron Commands

- **Start the app**: `npm start`
- **Build the app**: `npm run build`
- **Package the app**: `npm run electron-pack`

## Configuration

You can configure the following parameters through the app interface:

- **CLI Path**: The path to your Polaris CLI binary.
- **Host**: The hostname of the Polaris server.
- **Port**: The port number for connecting to the Polaris server.
- **Client ID**: The client ID for token-based authentication.
- **Client Secret**: The client secret for token-based authentication.

You can also define these configurations via environment variables by adding a `.env` file in the root of your project:

```bash
REACT_APP_POLARIS_CLI_PATH=/path/to/polaris/cli
REACT_APP_POLARIS_HOST=localhost
REACT_APP_POLARIS_PORT=8181
REACT_APP_POLARIS_CLIENT_ID=your-client-id
REACT_APP_POLARIS_CLIENT_SECRET=your-client-secret
```

## Available Features

### Catalog Management

- **List Catalogs**: Display a list of available catalogs from the Polaris CLI.
- **Create Catalog**: Add new catalogs by specifying their name, type, storage type, and base location.
- **Delete Catalog**: Remove existing catalogs from the system.

### Principal Management

- **List Principals**: Display a list of all principals available in the system.
- **Create Principals**: Add new principals via the interface.

### Role Management

- **List Roles**: View all principal roles.
- **Assign Roles**: Assign roles to principals directly through the interface.

## Development

### Preload Script

The app uses a **preload script** (`preload.js`) to securely expose the `runCommand` API to the renderer process (React). This API allows the React app to invoke CLI commands via Electron’s IPC (Inter-Process Communication).

### Electron Main Process

The main process (`electron.js`) listens for CLI command invocations from the renderer process, executes the commands using Node.js's `child_process.exec()`, and returns the output back to the React UI.

## Polaris CLI

The app interacts with the [Polaris CLI](https://github.com/apache/polaris), an open-source platform for managing data catalogs, principals, and roles. You must install the Polaris CLI on your system before using this Electron app.

To install the Polaris CLI, follow the installation instructions in the [Polaris CLI GitHub repository](https://github.com/apache/polaris).

## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.
