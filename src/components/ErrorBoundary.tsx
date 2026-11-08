import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Bir sorun olustu</h1>
          <p className="text-gray-400 mb-6 max-w-md">
            {this.state.error?.message || 'Beklenmeyen bir hata meydana geldi.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-500 transition-colors"
          >
            Sayfayi Yenile
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
