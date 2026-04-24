import { useState } from 'react';
import { Save } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  description: string;
}

const initialSettings: Setting[] = [
  { key: 'site_name', value: 'eCommerce Store', description: 'The name of your store' },
  { key: 'admin_email', value: 'admin@example.com', description: 'Primary admin contact email' },
  { key: 'currency', value: 'USD', description: 'Default currency for transactions' },
  { key: 'tax_rate', value: '8.5', description: 'Default tax rate percentage' },
  { key: 'shipping_fee', value: '10.00', description: 'Standard shipping fee' },
  { key: 'items_per_page', value: '20', description: 'Number of items to display per page' },
  { key: 'maintenance_mode', value: 'false', description: 'Enable maintenance mode' },
];

export function Settings() {
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setEditedSettings({ ...editedSettings, [key]: value });
  };

  const handleSave = () => {
    setSettings(settings.map(s =>
      editedSettings[s.key] !== undefined ? { ...s, value: editedSettings[s.key] } : s
    ));
    setEditedSettings({});
    alert('Settings saved successfully!');
  };

  const hasChanges = Object.keys(editedSettings).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure your eCommerce system</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
        {settings.map((setting) => (
          <div key={setting.key} className="p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <label className="block font-medium text-gray-900 mb-1">
                  {setting.key.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </label>
                <p className="text-sm text-gray-500 mb-3">{setting.description}</p>
              </div>
              <div className="w-64">
                {setting.key === 'maintenance_mode' ? (
                  <select
                    value={editedSettings[setting.key] || setting.value}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="false">Disabled</option>
                    <option value="true">Enabled</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editedSettings[setting.key] !== undefined ? editedSettings[setting.key] : setting.value}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Configuration Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Changes are not saved automatically - click "Save Changes" to apply</li>
          <li>Tax rate should be entered as a percentage (e.g., 8.5 for 8.5%)</li>
          <li>Currency codes should follow ISO 4217 standard (USD, EUR, GBP, etc.)</li>
          <li>Enable maintenance mode to temporarily disable public access</li>
        </ul>
      </div>
    </div>
  );
}
