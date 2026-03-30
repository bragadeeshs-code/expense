# Z-Expense-Management

Z-Expense-Management

## 🧰 Prerequisites

### 1. Install NVM (Node Version Manager)

Run the following command to install NVM:

**For Ubuntu**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

📚 For more details, refer to the [NVM documentation](https://github.com/nvm-sh/nvm?tab=readme-ov-file)

**For Windows**

Refer the [nvm-windows](https://github.com/coreybutler/nvm-windows)

### 2. Install Node.js (Using NVM)

Once NVM is installed, install and use the Node.js version specified in `.nvmrc`:

```
nvm install
nvm use
```

> Mention version if you are using the windows

## 🧾 Cloning the Repository

### 1. Install Git (if not already installed)

```
sudo apt install git-all
```

**For Windows**

🔗 Learn more at the official [Git documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### 2. Clone the Repository

```
git clone https://YavarTechworks@dev.azure.com/YavarTechworks/Z-Transact/_git/Expense-Web
cd react-template
```

## 📦 Install Dependencies

### Creating the env

Create the .env file by the command `cp .env.example .env` and update the values

### Install

Install all required packages:

```
npm install
```

## 💻 Run the Development Server

Start the app in development mode:

```
npm run dev
```

## 🏗️ Build for Production

To build the project for production:

```
npm run build
```

## Install the docker

Install the docker by the following command the [office webpage of docker](https://docs.docker.com/engine/install/ubuntu/)

### Run the app in the Docker

Use the below command to run the app in docker,

```bash
docker compose up -d --build
```

### Build the docker image

To build the docker image run the below command,

```bash
docker compose build
```
