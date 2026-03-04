import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Tables } from '../../lib/supabase';

interface Props {
  place?: Tables['destination_places'];
  destinationId: string;
  onClose: () => void;
  onSave: (place: Omit<Tables['destination_places'], 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const AddEditDestinationPlaceModal: React.FC<Props> = ({ place, destinationId, onClose, onSave }) => {
  const [name, setName] = useState(place?.name || '');
  const [description, setDescription] = useState(place?.description || '');
  const [imageUrl, setImageUrl] = useState(place?.image_url || '');
  const [openTime, setOpenTime] = useState(place?.open_time || '');
  const [closeTime, setCloseTime] = useState(place?.close_time || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!destinationId) {
      setError('Please select a destination');
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        destination_id: destinationId,
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl.trim(),
        open_time: openTime,
        close_time: closeTime,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save place');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {place ? 'Edit Place' : 'Add Place'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Open Time
                  </label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Close Time
                  </label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !destinationId}
                className={`px-4 py-2 text-white rounded-lg ${
                  loading || !destinationId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};