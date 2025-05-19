import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error Boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>SYSTEM ERROR</h2>
          <p>Rebooting interface...</p>
        </div>
      );
    }
    return this.props.children;
  }
}