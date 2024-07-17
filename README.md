# Expandable Table Project

This project is a React-based expandable table component that allows users to manage and display hierarchical data. It supports dynamic addition and deletion of rows and products, and calculates totals for each product and geography.

## Features

- **Dynamic Rows**: Add or delete geographies and sub-geographies.
- **Dynamic Products**: Add or delete products.
- **Totals Calculation**: Automatically computes and updates totals for each product and geography.
- **Data Persistence**: Saves the current state to `localStorage` so your changes persist across page reloads.
- **Expandable Sub-Geographies**: Toggle visibility of sub-geographies.

## Screenshots


## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager) or yarn

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/expandable-table.git
    cd expandable-table
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3. **Start the development server:**

    ```bash
    npm start
    ```

    or

    ```bash
    yarn start
    ```

    The app should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

- **Add a new geography** by clicking the "Add Geography" button.
- **Add a new product** by clicking the "Add Product" button.
- **Update cell values** by typing in the input fields.
- **Toggle sub-geographies** visibility by clicking the arrow button next to the geography name.
- **Save changes** to `localStorage` by clicking the "Update" button.

## Project Structure

- `src/`: Main source folder
  - `Table.js`: Main React component for the expandable table.
  - `Table.css`: Styles for the table.
- `public/`: Public folder containing static assets.
- `README.md`: Project documentation.

## CSS Styling

The table is styled using the provided `Table.css` file. Key styles include:

- **General Table Styles**: Basic table layout and styling.
- **Hover Effects**: Change row background color on hover.
- **Input Styling**: Styling for input fields within table cells.
- **Button Styling**: Styling for add and delete buttons.

## Contributing

Contributions are welcome! Please create an issue or submit a pull request.

## Acknowledgments

- This project was created with the help of React and modern JavaScript.



