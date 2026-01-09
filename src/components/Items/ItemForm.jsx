import React, { useState, useEffect } from 'react';

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    
    if (item) {
      onSubmit(item.id, { name, description });
    } else {
      onSubmit({ name, description });
    }
    
    setName('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {item ? 'Edit Item' : 'Add New Item'}
      </h2>
      <div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-cy="item-name-input"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            data-cy="item-description-input"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            data-cy="item-submit"
          >
            {item ? 'Update' : 'Add'} Item
          </button>
          {item && (
            <button
              onClick={onCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              data-cy="item-cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemForm;