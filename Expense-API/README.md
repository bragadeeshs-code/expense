# Expense Management API

## Install the Git and clone the code

### Install the git

Install the git in your system, by the following command

```bash
 sudo apt install git-all
```

for more visit the [official site for git-scm](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Clone the code

Run the below command to clone the code

```bash
git clone https://YavarTechworks@dev.azure.com/YavarTechworks/Z-Transact/_git/Expense-API
cd Expense-API
```

## Virtual Environment

### Install the Miniconda

To install the Miniconda, run the below command

```bash
mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm ~/miniconda3/miniconda.sh
source ~/miniconda3/bin/activate
conda init --all
```

For more visit the [official site](https://www.anaconda.com/docs/getting-started/miniconda/install#linux).

### Create the Virtual Environment

To create a virtual environment, run the following command:

```bash
conda create -n expense-api python=3.13 -y

```

### Activate the Virtual Environment

Run the following command based on your OS:

```bash
conda activate expense-api
```

### To deactivate an active environment, use

```bash
conda deactivate
```

## Dependencies

### Install Dependencies

To install the required dependencies, run:

```bash
pip install -r requirements.txt
pre-commit install
```

### Create the .env file

Run the below command to create the `.env` file. And update the file

```bash
cp .env.example .env
```

## Install the docker

Install the docker by the following command the [office webpage of docker](https://docs.docker.com/engine/install/ubuntu/)

## Start

To start the app, run the below command

### Creating the Docker Network

```bash
docker network create expense-api-net

```

### Start dev container

Build the image and start the containers. This starts the database, which is required for migrations.

```bash
docker compose up -d --build
```

### Option 1: Run Migrations & Seeders via Docker

#### Run Migrations

Run the migrations to set up the database schema:

```bash
docker compose run --rm api alembic upgrade head
```

#### Run Seeders

Populate the database with initial data:

```bash
docker compose run --rm api python -m app.seeders.seed
```

### Option 2: Run Migrations & Seeders Locally

If you prefer to run commands locally (requires Python environment activated):

#### Run Migrations

```bash
alembic upgrade head
```

#### Run Seeders

```bash
python -m app.seeders.seed
```

#### (Optional) Run App Locally

If you prefer to run the app locally instead of in Docker, update the .env to point out the host machine.

```bash
fastapi dev
```

## Production Deployment

### Build the image

```bash
docker compose -f compose.yml -f compose.prod.yml build
```


### Start the app

```bash
docker compose -f compose.yml -f compose.prod.yml up -d
```

### Build & Run the app

```bash
docker compose -f compose.yml -f compose.prod.yml up -d --build
```
