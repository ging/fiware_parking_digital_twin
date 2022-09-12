# Modeling digital twin data and architecture: a building guide with FIWARE as enabling technology

A real-time parking occupancy prediction system for Málaga's public parking facilities, built using FIWARE components, Apache Spark ML, and Kubernetes. This project leverages open data from Málaga City Council to train machine learning models and provide occupancy predictions through a web interface.

If you use or base your work on this project, please cite the following article:

```
@ARTICLE{9346030,
  author={Conde, Javier and Munoz-Arcentales, Andrés and Alonso, Álvaro and López-Pernas, Sonsoles and Salvachúa, Joaquín},
  journal={IEEE Internet Computing},
  title={Modeling Digital Twin Data and Architecture: A Building Guide With FIWARE as Enabling Technology},
  year={2022},
  volume={26},
  number={3},
  pages={7-14},
  keywords={Data models;Computer architecture;Digital twins;Market research;Proposals;Ecosystems;Computer architecture},
  doi={10.1109/MIC.2021.3056923}
}
```

## 📑 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Components](#components)
- [Data Flow](#data-flow)
- [FAIR Principles](#fair-principles)
- [Machine Learning Model](#machine-learning-model)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Overview

This application predicts the occupancy levels of public parking facilities in Málaga, Spain. It demonstrates a complete data pipeline from ingestion to real-time prediction:

- **Data Ingestion**: Fetches real-time parking data from Málaga's Open Data portal
- **Context Management**: Uses FIWARE Orion Context Broker for managing context information
- **Data Persistence**: Stores historical data in MongoDB with Draco (FIWARE's data persistence component)
- **Machine Learning**: Trains Random Forest models using Apache Spark MLlib
- **Real-time Predictions**: Provides instant occupancy predictions via a web interface
- **Orchestration**: Fully containerized and deployed on Kubernetes

### Supported Parking Facilities

- Salitre (435 spots)
- Av. de Andalucía (613 spots)
- Cervantes (409 spots)
- El Palo (127 spots)
- Camas (350 spots)
- Alcazaba (378 spots)
- Tejón y Rodriguez (187 spots)
- Cruz De Humilladero (217 spots)
- San Juan De La Cruz (624 spots)
- Pz. de la Marina (430 spots)

## 🏗️ Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                       │
│                                                               │
│  ┌──────────────┐        ┌──────────────┐                   │
│  │  Web UI      │◄──────►│    Orion     │                   │
│  │  (Node.js)   │        │Context Broker│                   │
│  └──────────────┘        └──────┬───────┘                   │
│         │                       │                            │
│         │                       ▼                            │
│         │              ┌─────────────────┐                  │
│         │              │     Draco       │                  │
│         │              │  (Historical)   │                  │
│         │              └────────┬────────┘                  │
│         │                       │                            │
│         ▼                       ▼                            │
│  ┌──────────────────────────────────────┐                  │
│  │         MongoDB (Replica Set)        │                  │
│  │    mongodb-0, mongodb-1, mongodb-2   │                  │
│  └────────────┬─────────────────────────┘                  │
│               │                                              │
│               ▼                                              │
│  ┌──────────────────────────────────────┐                  │
│  │        Apache Spark Jobs             │                  │
│  │  ┌──────────┐      ┌──────────┐     │                  │
│  │  │  Train   │      │ Predict  │     │                  │
│  │  │  Model   │      │ (Stream) │     │                  │
│  │  └──────────┘      └─────┬────┘     │                  │
│  └────────────────────────────┼─────────┘                  │
│                               │                             │
│                               ▼                             │
│                    ┌──────────────────┐                    │
│                    │   Orion Update   │                    │
│                    │  (Predictions)   │                    │
│                    └──────────────────┘                    │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │        Data Sink Job (Cron)          │                  │
│  │   Fetches data from OpenData API     │                  │
│  └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
         ▲
         │
         │
┌────────┴────────────┐
│  Málaga OpenData    │
│   Public API        │
└─────────────────────┘
```

## Technologies

### Core Technologies

- **[FIWARE Orion Context Broker](https://fiware-orion.readthedocs.io/)**: Context information management (NGSI-v2)
- **[FIWARE Draco](https://fiware-draco.readthedocs.io/)**: Historical data persistence
- **[Apache Spark 3.1.2](https://spark.apache.org/)**: Distributed data processing and machine learning
- **[MongoDB 3.6](https://www.mongodb.com/)**: Document database with replica set configuration
- **[Kubernetes](https://kubernetes.io/)**: Container orchestration platform
- **[Minikube](https://minikube.sigs.k8s.io/)**: Local Kubernetes cluster

### Application Stack

- **Backend**: Node.js (Express.js)
- **Frontend**: HTML5, JavaScript, Socket.io, Bulma CSS
- **ML Framework**: Spark MLlib (Random Forest Classifier)
- **Data Ingestion**: Python (pycurl, pymongo)
- **Build Tools**: SBT (Scala Build Tool), Docker

### Libraries & Dependencies

- **Node.js**: express, socket.io, mongoose, node-fetch, cross-fetch
- **Python**: pycurl, pymongo
- **Scala**: spark-core, spark-sql, spark-mllib, mongo-spark-connector

## Prerequisites

Before you begin, ensure you have the following installed:

- **Minikube** (v1.20+)
- **kubectl** (v1.20+)
- **Docker** (v20.10+)
- **Git**
- **curl**
- **bash/zsh shell**

### System Requirements

- **RAM**: Minimum 8GB (16GB recommended)
- **CPU**: 4 cores minimum
- **Disk Space**: 20GB free space
- **OS**: macOS, Linux, or Windows with WSL2

### Minikube Configuration

Start Minikube with adequate resources:

```bash
minikube start --cpus=4 --memory=8192 --disk-size=20g
```

Enable required addons:

```bash
minikube addons enable ingress
minikube addons enable storage-provisioner
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fiware_helloWorld
```

### 2. Deploy the Complete Stack

The entire application can be deployed with a single script:

```bash
chmod +x create_cluster.sh
./create_cluster.sh
```

This script will:
1. Create the `tfm` namespace
2. Deploy MongoDB replica set (3 nodes)
3. Configure MongoDB replication
4. Deploy MongoDB Express UI
5. Deploy Orion Context Broker
6. Deploy Draco for data persistence
7. Create Spark service accounts and volumes
8. Deploy the prediction web application
9. Run the data sink job to populate initial data
10. Create FIWARE entities and subscriptions
11. Submit Spark prediction job

**Note**: The deployment process takes approximately 3-5 minutes.

### 3. Access the Application

Once deployed, get the service URLs:

```bash
minikube service list
```

Access the web interface:

```bash
minikube service web-service -n tfm
```

Or access via Ingress (if configured):

```bash
echo "http://$(minikube ip)"
```

## 📁 Project Structure

```
fiware_helloWorld/
├── create_cluster.sh              # Main deployment script
├── .env                          # Environment variables
│
├── kubernetes/                   # Kubernetes manifests
│   ├── draco-deployment.yaml     # Draco deployment
│   ├── draco-service.yaml        # Draco service
│   ├── mongodb-statefulSet.yaml  # MongoDB stateful set (3 replicas)
│   ├── mongodb-sc.yaml           # MongoDB storage class
│   ├── mongodb-hservice.yaml     # MongoDB headless service
│   ├── mongodb-express.yaml      # MongoDB web UI
│   ├── orion-deployment.yaml     # Orion Context Broker deployment
│   ├── orion-service.yaml        # Orion service
│   ├── prediction-web-deployment.yaml  # Web UI deployment
│   ├── spark-pv.yaml             # Spark persistent volume
│   ├── spark-pvc.yaml            # Spark persistent volume claim
│   ├── spark-hservice.yaml       # Spark headless service
│   ├── jupyterlab-*.yaml         # JupyterLab components (optional)
│   ├── minikube-ingress.yaml     # Ingress configuration
│   └── Jobs/
│       └── sink-job.yaml         # Data ingestion job
│
├── prediction-web/               # Web application
│   ├── app.js                    # Express server with Socket.io
│   ├── package.json              # Node.js dependencies
│   ├── Dockerfile                # Container image
│   ├── build-image.sh            # Image build script
│   ├── public/                   # Static files
│   │   ├── index.html            # Main UI
│   │   ├── predictions.html      # Predictions view
│   │   ├── predict.js            # Client-side logic
│   │   └── *.css, *.js           # Assets
│   └── entities/                 # FIWARE entity scripts
│       ├── createPredictionEntities.sh
│       ├── curlEntities.sh
│       ├── subscribeReqPredictionTicket.sh
│       ├── subscribeResPredictionTicket.sh
│       └── subscribeResDracoPredictionTicket.sh
│
├── spark-job/                    # Spark ML jobs
│   ├── build.sbt                 # SBT build configuration
│   ├── Train.scala               # Model training job
│   ├── Prediction.scala          # Real-time prediction job
│   ├── spark-submit-train.sh     # Training job submission
│   ├── spark-submit-predict.sh   # Prediction job submission
│   ├── spark-create-submit-train.sh
│   └── spark-create-submit-predict.sh
│
├── data-sink-job/                # Data ingestion
│   ├── update-db.py              # Python script to fetch OpenData
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Container image
│
├── spark-notebook/               # JupyterLab environment
│   ├── Dockerfile
│   └── build_image.sh
│
└── statefulset/                  # MongoDB configuration
    ├── commands.sh
    └── mongodb-rsconfig.sh       # Replica set initialization
```

## 🧩 Components

### 1. Orion Context Broker

**Purpose**: FIWARE Generic Enabler for managing context information using NGSI-v2 API.

**Configuration**:
- Port: 1026
- Version: 2.3.0
- Database: MongoDB replica set
- Log Level: DEBUG
- HTTP Timeout: 15000ms

**Entities**:
- Parking occupancy entities (current state)
- Prediction request entities
- Prediction response entities

### 2. Draco

**Purpose**: FIWARE data persistence component for storing historical context information.

**Features**:
- Subscribes to Orion Context Broker changes
- Stores historical data in MongoDB
- Enables time-series analysis

### 3. MongoDB Replica Set

**Purpose**: Distributed database for storing parking data and predictions.

**Configuration**:
- Replica Set: `MainRepSet`
- Nodes: 3 (mongodb-0, mongodb-1, mongodb-2)
- Port: 27017
- Storage: Persistent volumes with StorageClass

**Collections**:
- `parking`: Historical parking occupancy data
- `sth_test`: Real-time predictions and requests

### 4. Spark ML Jobs

#### Training Job (`Train.scala`)

**Purpose**: Trains a Random Forest classification model to predict parking occupancy levels.

**Features**:
- Reads historical data from MongoDB
- Feature engineering: weekday, hour, month
- Random Forest with 200 trees
- 80/20 train-test split
- Saves model to persistent volume

**Model Parameters**:
- Algorithm: Random Forest Classifier
- Number of trees: 200
- Feature subset strategy: log2
- Input features: parking name, weekday, hour, month
- Output: Occupancy level (0-10 scale)

#### Prediction Job (`Prediction.scala`)

**Purpose**: Real-time streaming job that receives prediction requests and returns results.

**Features**:
- Listens for NGSI notifications from Orion (port 9001)
- Loads pre-trained model from persistent volume
- Processes prediction requests in real-time
- Sends results back to Orion Context Broker

**Flow**:
1. Receives entity update from Orion
2. Extracts features (name, weekday, hour)
3. Applies ML pipeline and model
4. Sends prediction back to Orion
5. Web UI receives notification via subscription

### 5. Web Application

**Purpose**: User interface for requesting and displaying parking occupancy predictions.

**Technologies**:
- Express.js server
- Socket.io for real-time communication
- Mongoose for MongoDB integration
- Bulma CSS framework

**Features**:
- Interactive parking selection
- Date and time picker
- Real-time prediction results
- Historical predictions view
- WebSocket-based updates

**Ports**:
- Internal: 3000
- NodePort: 30003

### 6. Data Sink Job

**Purpose**: Kubernetes CronJob that fetches real parking data from Málaga OpenData API.

**Configuration**:
- Source: `https://datosabiertos.malaga.eu/recursos/aparcamientos/ocupappublicosmun/ocupappublicosmunfiware.json`
- Destination: MongoDB collection `parking`
- Adds timestamp metadata to each record

**Schedule**: Can be configured as a CronJob for periodic updates.

## 🔄 Data Flow

### Training Phase

```
┌─────────────────┐
│  Data Sink Job  │
│   (Python)      │
└────────┬────────┘
         │
         │ Fetches parking data
         ▼
┌──────────────────────┐
│   Málaga OpenData    │
│   Public API         │
└──────────┬───────────┘
           │
           │ Stores JSON data
           ▼
    ┌─────────────┐
    │   MongoDB   │
    │  (parking)  │
    └──────┬──────┘
           │
           │ Reads historical data
           ▼
    ┌─────────────┐
    │ Spark Train │
    │    Job      │
    └──────┬──────┘
           │
           │ Saves model
           ▼
    ┌─────────────┐
    │ Persistent  │
    │   Volume    │
    └─────────────┘
```

### Prediction Phase

```
┌────────────┐
│ User Browser│
└──────┬─────┘
       │ Enters prediction request
       ▼
┌─────────────────┐
│   Web UI        │
│  (Socket.io)    │
└─────┬───────────┘
      │
      │ PATCH request
      ▼
┌────────────────┐
│ Orion Context  │◄────┐
│    Broker      │     │
└─────┬──────────┘     │
      │                │
      │ Notification   │ PATCH prediction result
      ▼                │
┌────────────────┐     │
│ Spark Predict  │─────┘
│  (Streaming)   │
└────────────────┘
      │
      │ Model inference
      ▼
┌────────────────┐
│ ML Model       │
│ (Random Forest)│
└────────────────┘
      │
      │ Prediction sent to Web UI
      ▼
┌────────────────┐
│ User receives  │
│   prediction   │
└────────────────┘
```

### Data Persistence Flow

```
┌────────────────┐
│ Orion Context  │
│    Broker      │
└─────┬──────────┘
      │
      │ Subscription
      ▼
┌────────────────┐
│     Draco      │
└─────┬──────────┘
      │
      │ Stores historical data
      ▼
┌────────────────┐
│    MongoDB     │
│  (sth_test)    │
└────────────────┘
```

## 📊 FAIR Principles

This project implements the **FAIR Data Principles** (Findable, Accessible, Interoperable, and Reusable) to ensure effective data management and maximize the value of the parking occupancy digital twin.

### F - Findable

**Data and metadata are easy to find for both humans and computers.**

✅ **Implementation:**

1. **Standardized Entity Identification**
   - Each parking facility has a unique identifier in the FIWARE Orion Context Broker
   - Entities follow FIWARE Smart Data Models conventions
   - Consistent naming scheme across all parking facilities

2. **Searchable APIs**
   - RESTful API endpoints for querying entities: `GET /v2/entities`
   - Filter capabilities by entity type, attributes, and metadata
   - MongoDB indexes for efficient historical data retrieval

3. **Metadata Documentation**
   - Entity attributes include type information and metadata
   - Timestamps (`dateObserved`, `dateCreated`, `dateModified`) for all records
   - Comprehensive API documentation in this README

4. **Data Catalog**
   - All parking facilities catalogued with name, location, and capacity
   - MongoDB collections organized by data type and purpose
   - Version-controlled deployment configurations

### A - Accessible

**Data can be accessed through standardized protocols and remains available over time.**

✅ **Implementation:**

1. **Open Standards & Protocols**
   - **NGSI-v2**: Standard context information management protocol
   - **HTTP/REST**: Universal web protocols for all API interactions
   - **WebSocket (Socket.io)**: Real-time bidirectional communication
   - **MongoDB Wire Protocol**: Standard database access

2. **Public Data Source**
   - Data sourced from Málaga City Council's Open Data portal
   - Publicly accessible endpoint: `datosabiertos.malaga.eu`
   - No authentication required for public endpoints

3. **Persistent Storage**
   - Historical data stored in MongoDB replica set (3 nodes)
   - Kubernetes Persistent Volumes ensure data durability
   - Daily backups possible through MongoDB snapshot mechanisms

4. **Service Availability**
   - High availability through Kubernetes orchestration
   - MongoDB replica set provides automatic failover
   - Load balancing and service discovery via Kubernetes services

5. **Multiple Access Patterns**
   - Web UI for end users
   - RESTful APIs for programmatic access
   - MongoDB direct access for analytics
   - Socket.io for real-time updates

### I - Interoperable

**Data can be integrated with other data and work with different applications.**

✅ **Implementation:**

1. **Standard Data Formats**
   - **JSON**: Universal data interchange format for all APIs
   - **NGSI-v2**: FIWARE standard for context information
   - **BSON**: MongoDB native format, JSON-compatible
   - **Parquet**: Considered for Spark data processing

2. **FIWARE Ecosystem Integration**
   - Compatible with all FIWARE Generic Enablers
   - Orion Context Broker as the central integration point
   - Draco for seamless data persistence
   - Can integrate with FIWARE IoT Agents, CEP, Big Data components

3. **Standardized Vocabulary**
   - Follows FIWARE Smart Data Models
   - Attributes use common semantic conventions:
     - `name`, `location`, `capacity`, `availableSpots`, `totalSpots`
     - Temporal attributes: `dateObserved`, `dateCreated`, `dateModified`
   - Occupancy levels normalized to 0-10 scale

4. **Platform-Independent Architecture**
   - Containerized components run on any Kubernetes cluster
   - Docker images portable across environments
   - Cloud-agnostic design (works on AWS, Azure, GCP, on-premise)

5. **Open APIs**
   - RESTful endpoints follow OpenAPI/Swagger conventions
   - WebSocket protocol for real-time communication
   - No proprietary protocols or vendor lock-in

6. **Data Exchange Capabilities**
   - NGSI subscriptions for event-driven integration
   - HTTP callbacks for asynchronous notifications
   - Batch data export via MongoDB queries
   - Real-time streaming through Socket.io

### R - Reusable

**Data and models are well-described and can be replicated and combined in different settings.**

✅ **Implementation:**

1. **Comprehensive Documentation**
   - Detailed README with architecture diagrams
   - Inline code comments in all components
   - API endpoint documentation with examples
   - Step-by-step deployment instructions

2. **Automation & Reproducibility**
   - One-command deployment script: `./create_cluster.sh`
   - Infrastructure as Code (Kubernetes manifests)
   - Dockerfiles for reproducible container builds
   - Version-pinned dependencies in all package managers

3. **Open Source Components**
   - FIWARE Orion (Apache 2.0)
   - Apache Spark (Apache 2.0)
   - MongoDB (Server Side Public License)
   - Node.js ecosystem (MIT/Apache licenses)

4. **Modular Architecture**
   - Loosely coupled microservices
   - Components can be replaced or upgraded independently
   - Clear separation of concerns:
     - Data ingestion (Python)
     - Context management (Orion)
     - Persistence (MongoDB, Draco)
     - ML processing (Spark)
     - Presentation (Node.js)

5. **Model Reusability**
   - ML model saved in Spark's native format
   - Feature engineering pipeline persisted separately
   - Model can be exported for use in other frameworks
   - Training code documented and parameterized

6. **Extensibility**
   - Add new parking facilities by updating entity configurations
   - Extend features by modifying Spark ML pipeline
   - Integrate additional data sources through Orion subscriptions
   - Plugin architecture for new visualizations

7. **Clear Licensing**
   - Project licensed for academic and research use
   - Third-party dependencies properly attributed
   - Citation information provided at the top of README

8. **Version Control**
   - All code version-controlled in Git
   - Docker images tagged with versions
   - Component versions explicitly specified in manifests

### FAIR Impact

By implementing FAIR principles, this digital twin system:

- **Enables collaboration** across institutions and research groups
- **Facilitates reproducibility** of experiments and results
- **Promotes innovation** by allowing others to build upon this work
- **Ensures long-term value** of the data and infrastructure
- **Supports open science** and transparent research practices
- **Allows integration** with broader smart city initiatives

### Future FAIR Enhancements

Potential improvements to strengthen FAIR compliance:

- **Persistent Identifiers**: Add DOIs for datasets and model versions
- **Rich Metadata**: Implement schema.org or DCAT metadata
- **Data Provenance**: Record complete lineage of predictions
- **FAIR Metrics**: Regular assessment using FAIR maturity indicators
- **Data Catalog**: Deploy CKAN or similar catalog software
- **Semantic Web**: Add RDF/Linked Data capabilities
- **License Headers**: Add SPDX license identifiers to all files

## 🤖 Machine Learning Model

### Model Architecture

**Algorithm**: Random Forest Classifier

**Why Random Forest?**
- Handles non-linear relationships
- Robust to outliers
- Provides feature importance
- Good accuracy for categorical predictions
- No need for feature scaling

### Features

| Feature | Type | Description | Example |
|---------|------|-------------|---------|
| `name` | Categorical | Parking facility name | "Salitre" |
| `weekday` | Categorical | Day of week (1-7) | 3 (Tuesday) |
| `hour` | Numerical | Hour of day (0-23) | 14 |
| `month` | Numerical | Month (1-12) | 6 (June) |

### Feature Engineering

1. **String Indexing**: Converts categorical features to numerical indices
2. **One-Hot Encoding**: Converts indices to binary vectors
3. **Vector Assembly**: Combines all features into a single feature vector

### Target Variable

**Occupancy Level**: Discretized into 10 levels (0-10)

Calculation:
```
available_ratio = availableSpots / totalSpots
occupation_percentage = (1 - available_ratio) * 100
occupation_level = round(occupation_percentage / 10)
```

- **0**: 0-10% occupied (almost empty)
- **5**: 50-60% occupied (half full)
- **10**: 90-100% occupied (nearly full)

### Model Performance

The model is evaluated using:
- **Metric**: Multiclass Classification Accuracy
- **Train-Test Split**: 80/20
- **Validation**: Hold-out validation

Typical accuracy: ~75-85% (varies based on training data volume)

### Model Persistence

Models are saved to a Kubernetes Persistent Volume:
- **Location**: `/opt/spark/work-dir/models/`
- **Format**: Spark ML native format
- **Components**: 
  - `model/`: Trained Random Forest model
  - `pipeline/`: Feature engineering pipeline

## 🔌 API Endpoints

### Web Application API

#### POST /notify

Receives notifications from Orion Context Broker with prediction results.

**Request Body**:
```json
{
  "data": [
    {
      "socketId": {"value": "socket-123"},
      "predictionId": {"value": "pred-456"},
      "predictionValue": {"value": 7},
      "name": {"value": "Salitre"},
      "weekday": {"value": 3},
      "time": {"value": 14}
    }
  ]
}
```

**Response**: `200 OK`

#### GET /predictions.html

Displays historical predictions.

#### Static Files

- `GET /`: Main prediction interface
- `GET /predictions.html`: Historical predictions

### Orion Context Broker API

Base URL: `http://<minikube-ip>:30329/v2`

#### Get All Entities

```bash
curl http://<minikube-ip>:30329/v2/entities
```

#### Get Specific Entity

```bash
curl http://<minikube-ip>:30329/v2/entities/<entity-id>
```

#### Update Entity

```bash
curl -X PATCH http://<minikube-ip>:30329/v2/entities/<entity-id>/attrs \
  -H "Content-Type: application/json" \
  -d '{
    "name": {"value": "Salitre", "type": "String"},
    "weekday": {"value": 3, "type": "Integer"},
    "time": {"value": 14, "type": "Integer"}
  }'
```

### Socket.io Events

#### Client → Server

**Event**: `predict`

**Payload**:
```javascript
{
  name: "Salitre",
  year: 2026,
  month: 2,
  day: 21,
  weekday: 5,
  time: 14,
  predictionId: "unique-id"
}
```

#### Server → Client

**Event**: `messages`

**Types**:

1. **CONFIRMATION**
```javascript
{
  type: "CONFIRMATION",
  payload: {
    msg: "Your request is being processed"
  }
}
```

2. **PREDICTION**
```javascript
{
  type: "PREDICTION",
  payload: {
    socketId: "socket-123",
    name: "Salitre",
    weekday: 3,
    time: 14,
    predictionId: "pred-456",
    predictionValue: 7
  }
}
```

3. **ERROR**
```javascript
{
  type: "ERROR",
  payload: {
    msg: "There has been a problem with your request"
  }
}
```

## ⚙️ Configuration

### Environment Variables

Create or modify `.env` file:

```bash
# Orion Context Broker
ORION_PORT=1026
ORION_VERSION=2.3.0

# MongoDB
MONGO_DB_PORT=27017
MONGO_DB_VERSION=3.6

# Web Client
WEB_CLIENT_PORT=3000
CONTEXT_BROKER=http://orion:1026/v2
NGSI_VERSION=ngsi-v2
```

### Kubernetes Resources

#### MongoDB StatefulSet

```yaml
replicas: 3
storageClass: mongodb-sc
volumeClaimTemplate: 1Gi per replica
```

#### Orion Deployment

```yaml
replicas: 1
args:
  - "-dbhost": MongoDB replica set connection string
  - "-rplSet": MainRepSet
  - "-logLevel": DEBUG
  - "-httpTimeout": 15000
```

#### Spark Jobs

**Resource Requests** (adjust based on your cluster):
```yaml
spark.executor.instances: 1
spark.executor.memory: 2g
spark.driver.memory: 2g
```

### Scaling

#### Scale MongoDB Replicas

```bash
kubectl scale statefulset mongodb --replicas=5 -n tfm
```

#### Scale Orion

```bash
kubectl scale deployment orion --replicas=3 -n tfm
```

#### Scale Web Application

```bash
kubectl scale deployment web-deployment --replicas=2 -n tfm
```

## 📖 Usage

### Making a Prediction

1. **Access the Web Interface**:
   ```bash
   minikube service web-service -n tfm
   ```

2. **Select Parameters**:
   - Choose a parking facility from the dropdown
   - Select a date using the calendar
   - Pick an hour slot (0-23)

3. **Submit Request**:
   - Click the submit button
   - Wait for confirmation message
   - Prediction result appears in seconds

4. **Interpret Results**:
   - Prediction value: 0-10 scale
   - 0-3: Low occupancy (easy to find parking)
   - 4-7: Medium occupancy (some spots available)
   - 8-10: High occupancy (difficult to find parking)

### Training a New Model

1. **Ensure sufficient data** in MongoDB:
   ```bash
   kubectl exec -it mongodb-0 -n tfm -- mongo
   > use tfm
   > db.parking.count()
   ```

2. **Submit training job**:
   ```bash
   cd spark-job
   ./spark-submit-train.sh
   ```

3. **Monitor training**:
   ```bash
   kubectl logs -f -n tfm -l job=training
   ```

4. **Verify model** saved to persistent volume:
   ```bash
   kubectl exec -it <spark-driver-pod> -n tfm -- ls /opt/spark/work-dir/models/
   ```

5. **Restart prediction job** to use new model:
   ```bash
   kubectl delete pod -n tfm -l job=prediction
   ./spark-submit-predict.sh
   ```

### Viewing Historical Data

```bash
# Access MongoDB
kubectl exec -it mongodb-0 -n tfm -- mongo

# Query parking data
> use tfm
> db.parking.find().limit(10).pretty()

# Count documents
> db.parking.count()

# Query predictions
> use sth_test
> db.Pred.find().limit(10).pretty()
```

### Monitoring Logs

```bash
# Orion logs
kubectl logs -f deployment/orion -n tfm

# Web application logs
kubectl logs -f deployment/web-deployment -n tfm

# Spark prediction logs
kubectl logs -f -n tfm -l job=prediction

# Draco logs
kubectl logs -f deployment/draco -n tfm
```

## 🔧 Troubleshooting

### Issue: MongoDB pods not starting

**Symptoms**: Pods stuck in `Pending` or `CrashLoopBackOff`

**Solutions**:
```bash
# Check PVC status
kubectl get pvc -n tfm

# Check storage class
kubectl get sc

# Ensure sufficient disk space
minikube ssh "df -h"

# Delete and recreate
kubectl delete statefulset mongodb -n tfm
kubectl delete pvc -n tfm -l app=mongodb
kubectl apply -f kubernetes/mongodb-sc.yaml
kubectl apply -f kubernetes/mongodb-statefulSet.yaml
```

### Issue: Orion cannot connect to MongoDB

**Symptoms**: Orion logs show connection errors

**Solutions**:
```bash
# Verify MongoDB replica set status
kubectl exec -it mongodb-0 -n tfm -- mongo --eval "rs.status()"

# Check MongoDB service
kubectl get svc mongodb-svc -n tfm

# Verify replica set configuration
sh statefulset/mongodb-rsconfig.sh mongodb-0
```

### Issue: Spark job fails to submit

**Symptoms**: Error during spark-submit

**Solutions**:
```bash
# Verify service account
kubectl get serviceaccount spark -n tfm

# Check cluster role binding
kubectl get clusterrolebinding spark-role

# Ensure Spark image is accessible
kubectl describe pod <spark-driver-pod> -n tfm

# Check Spark PVC
kubectl get pvc spark-pvc -n tfm
```

### Issue: Predictions not returning

**Symptoms**: Web UI shows "processing" but no result

**Solutions**:
```bash
# Check Spark prediction job is running
kubectl get pods -n tfm -l job=prediction

# Verify Orion subscriptions
curl http://$(minikube ip):30329/v2/subscriptions

# Check logs
kubectl logs -f deployment/web-deployment -n tfm
kubectl logs -f -n tfm -l job=prediction

# Verify network connectivity
kubectl exec -it <web-pod> -n tfm -- curl http://orion:1026/version
```

### Issue: Data sink job fails

**Symptoms**: No data in MongoDB parking collection

**Solutions**:
```bash
# Check job status
kubectl get jobs -n tfm

# View job logs
kubectl logs -n tfm job/sink-job

# Verify network access to OpenData API
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -n tfm -- \
  curl https://datosabiertos.malaga.eu/recursos/aparcamientos/ocupappublicosmun/ocupappublicosmunfiware.json

# Manually run job
kubectl delete job sink-job -n tfm
kubectl apply -f kubernetes/Jobs/sink-job.yaml
```

### Issue: Out of memory errors

**Symptoms**: Pods OOMKilled

**Solutions**:
```bash
# Increase Minikube memory
minikube stop
minikube start --cpus=4 --memory=16384

# Adjust Spark memory settings in spark-submit scripts
# Edit spark-submit-*.sh files:
--conf "spark.executor.memory=4g"
--conf "spark.driver.memory=4g"
```

### Issue: Cannot access services

**Symptoms**: `minikube service` command hangs or fails

**Solutions**:
```bash
# Check Minikube status
minikube status

# Verify tunnel
minikube tunnel

# Use port-forward as alternative
kubectl port-forward -n tfm deployment/web-deployment 3000:3000

# Check NodePort services
kubectl get svc -n tfm
```

### Complete Reset

If all else fails, completely reset the deployment:

```bash
# Delete namespace
kubectl delete namespace tfm

# Clean up persistent volumes
kubectl delete pv --all

# Restart Minikube
minikube stop
minikube delete
minikube start --cpus=4 --memory=8192

# Redeploy
./create_cluster.sh
```

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

### Areas for Improvement

1. **Model Enhancement**:
   - Add more features (weather, events, holidays)
   - Try different algorithms (XGBoost, Neural Networks)
   - Implement hyperparameter tuning
   - Add model versioning

2. **Data Pipeline**:
   - Implement real-time data ingestion
   - Add data validation and cleaning
   - Create data quality dashboard
   - Implement incremental model training

3. **Infrastructure**:
   - Add Helm charts
   - Implement GitOps with ArgoCD
   - Add monitoring (Prometheus, Grafana)
   - Implement service mesh (Istio)

4. **Application**:
   - Add user authentication
   - Improve UI/UX
   - Add mobile support
   - Implement caching layer (Redis)

5. **Testing**:
   - Unit tests for all components
   - Integration tests
   - Load testing
   - CI/CD pipeline

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a Master's Thesis at Universidad Politécnica de Madrid (UPM).


## 🙏 Acknowledgments

- **Málaga City Council** for providing open data
- **FIWARE Foundation** for the open-source components
- **Apache Spark** community
- **Universidad Politécnica de Madrid**

## 📚 References

- [FIWARE Documentation](https://fiware.org/)
- [Orion Context Broker](https://fiware-orion.readthedocs.io/)
- [Apache Spark MLlib](https://spark.apache.org/mllib/)
- [Málaga OpenData Portal](https://datosabiertos.malaga.eu/)
- [NGSI-v2 Specification](https://fiware.github.io/specifications/ngsiv2/stable/)

