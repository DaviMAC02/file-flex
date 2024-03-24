
# file-flex

FileFlex is a versatile package designed to abstract file operations across various cloud providers, making your project cloud-agnostic. With FileFlex, you can effortlessly switch between cloud storage providers like Azure and AWS without changing your codebase. It's perfect for applications that need the flexibility to work with different storage solutions or for developers looking to build cloud-independent applications.

## Features

- **Cloud Agnostic**: Easily switch between cloud storage providers.
- **Support for Azure and AWS**: Seamless integration with Azure Blob Storage and Amazon S3.
- **Local Storage Support**: Includes a local storage option for development, testing, or debugging purposes.
- **Environment Variable Integration**: Leverages environment variables for secure credential management.

## Installation

To install FileFlex, run the following command in your project directory:

```bash
npm install file-flex
```

## Usage

### Importing FileFlexClient

Start by importing `FileFlexClient` from the `file-flex` package:

```javascript
import { FileFlexClient } from 'file-flex';
```

### Configuration

FileFlex allows you to configure clients for Azure, AWS, or local storage based on your needs. Below are examples of how to set up each type of client.

#### Azure Blob Storage

```javascript
const client = new FileFlexClient({
  AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
  AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
});
```

#### Amazon S3

```javascript
const client = new FileFlexClient({
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});
```

#### Local Storage (No Provider)

For development, testing, or debugging purposes, you might want to use local storage. This requires no external provider setup:

```javascript
const client = new FileFlexClient({ LOCAL: true });
```

## Contributing

We welcome contributions to the FileFlex project.
[File Flex Repository](https://github.com/DaviMAC02/file-flex)

## License

FileFlex is licensed under MIT License, see the LICENSE file for details.