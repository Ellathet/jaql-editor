'use client';

import { useState, useRef } from 'react';
import { FileJson } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { parseJaqlJson, validateJaqlStructure, exportToJson } from '@/app/utils';
import { FilterForm } from '@/app/FilterForm';
import { FilterItem, JaqlFilterState } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [filters, setFilters] = useState<JaqlFilterState[]>([]);
  const [error, setError] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const exportTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleParse = () => {
    try {
      setError('');
      const parsed = parseJaqlJson(jsonInput);
      
      if (!validateJaqlStructure(parsed)) {
        setError(
          'Invalid JAQL structure. Each filter must have an instanceid and either jaql or isCascading property.'
        );
        return;
      }

      setFilters(parsed as JaqlFilterState[]);
      setJsonOutput('');
      setShowOutput(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse JSON');
    }
  };

  const handleFilterChange = (index: number, updated: JaqlFilterState) => {
    const newFilters = [...filters];
    newFilters[index] = updated;
    setFilters(newFilters);
  };

  const handleExport = () => {
    const output = exportToJson(filters as FilterItem[]);
    setJsonOutput(output);
    setShowOutput(true);
    setTimeout(() => {
      exportTextareaRef.current?.focus();
      exportTextareaRef.current?.select();
    }, 0);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([jsonOutput], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `jaql-filters-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F7F8FA' }}>
      <Toaster />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JAQL Filter Editor</h1>
          <p className="text-gray-600">
            Paste your JAQL JSON, edit filter values, and export the modified configuration
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Input */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Input JAQL JSON</h2>

              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JAQL JSON array or object here..."
                className="w-full h-96 font-mono text-sm resize-none"
              />

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleParse}
                disabled={!jsonInput.trim()}
                className="mt-4 w-full"
              >
                Parse & Load Filters
              </Button>

              {filters.length > 0 && (
                <Alert className="mt-4">
                  <AlertDescription>
                    ✓ Loaded {filters.length} filter{filters.length !== 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Right column - Output preview */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Export Results</h2>

              {!showOutput ? (
                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed rounded-lg" style={{ borderColor: '#D1E8E4', backgroundColor: '#F7F8FA' }}>
                  <FileJson className="w-12 h-12 mb-3" style={{ color: '#A0AEC0' }} />
                  <p className="text-center" style={{ color: '#4A5568' }}>
                    Edit the filters on the left and click <br />
                    <span className="font-semibold">Export Results</span> to preview
                  </p>
                </div>
              ) : (
                <>
                  <Textarea
                    ref={exportTextareaRef}
                    value={jsonOutput}
                    readOnly
                    className="w-full h-96 font-mono text-sm resize-none"
                  />
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={handleCopyToClipboard}
                      variant="secondary"
                      className="flex-1"
                    >
                      Copy to Clipboard
                    </Button>
                    <Button
                      onClick={handleDownload}
                      className="flex-1"
                    >
                      Download JSON
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters editor */}
        {filters.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Edit Filters</h2>

              <div className="space-y-6">
                {filters.map((filter, index) => (
                  <div key={index}>
                    <FilterForm
                      filter={filter}
                      onChange={(updated) => handleFilterChange(index, updated)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                <Button
                  onClick={handleExport}
                >
                  Export Results
                </Button>
                <Button
                  onClick={() => {
                    setFilters([]);
                    setJsonInput('');
                    setError('');
                  }}
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
