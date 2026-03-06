'use client';

/**
 * Local filter tile — a copy of the filter UI inside the project.
 * No dependency on Compose SDK (CSDK); no server fetch. All state comes from JAQL.
 */

import { JaqlFilterState } from '@/app/types';
import { updateFilterValue, getFilterTitle } from '@/app/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FilterTileProps {
  filter: JaqlFilterState;
  onChange: (filter: JaqlFilterState) => void;
}

export function FilterTile({ filter, onChange }: FilterTileProps) {
  const title = getFilterTitle(filter);
  const datatype = filter.jaql?.datatype || 'text';

  const handleFilterChange = (field: string, value: unknown) => {
    const updated = updateFilterValue(filter, field, value);
    onChange(updated);
  };

  const handleMemberChange = (index: number, value: string) => {
    const members = [...(filter.jaql?.filter?.members || [])];
    members[index] = value;
    handleFilterChange('jaql.filter.members', members);
  };

  const addMember = () => {
    const members = [...(filter.jaql?.filter?.members || []), ''];
    handleFilterChange('jaql.filter.members', members);
  };

  const removeMember = (index: number) => {
    const members = filter.jaql?.filter?.members?.filter((_, i) => i !== index) || [];
    handleFilterChange('jaql.filter.members', members);
  };

  const formatDateToUSA = (dateStr: string): string => {
    if (!dateStr) return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}/${year}`;
    }
    return dateStr;
  };

  const formatDateToISO = (dateStr: string): string => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [month, day, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const renderMemberInput = (member: string, index: number) => {
    const isDateType = datatype === 'datetime' || datatype === 'date';

    if (isDateType) {
      const displayValue = formatDateToUSA(member);
      return (
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => {
            const usaDate = e.target.value;
            const isoDate = formatDateToISO(usaDate);
            handleMemberChange(index, isoDate);
          }}
          placeholder="MM/DD/YYYY"
        />
      );
    }

    const inputType = datatype === 'numeric' ? 'number' : 'text';

    return (
      <Input
        type={inputType}
        value={member}
        onChange={(e) => handleMemberChange(index, e.target.value)}
        placeholder={datatype === 'numeric' ? 'Enter number value' : 'Enter member value'}
      />
    );
  };

  // Non-cascading filter tile
  if (!filter.isCascading && filter.jaql) {
    const filterConfig = filter.jaql.filter;

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">{title}</CardTitle>
              {filter.jaql?.isPrimary && (
                <Badge variant="secondary">Primary</Badge>
              )}
            </div>
            {datatype && (
              <span
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white"
                style={{ backgroundColor: '#1F5FB0' }}
              >
                {datatype}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Column</label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                  {filter.jaql.column}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Table</label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                  {filter.jaql.table}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`explicit-${filter.instanceid}`}
                checked={filterConfig.explicit || false}
                onCheckedChange={(checked) => {
                  handleFilterChange('jaql.filter.explicit', checked);
                  if (checked) handleFilterChange('jaql.filter.all', false);
                }}
              />
              <label
                htmlFor={`explicit-${filter.instanceid}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Explicit Filter
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`multi-${filter.instanceid}`}
                checked={filterConfig.multiSelection || false}
                onCheckedChange={(checked) =>
                  handleFilterChange('jaql.filter.multiSelection', checked)
                }
              />
              <label
                htmlFor={`multi-${filter.instanceid}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Multi-Selection
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`all-${filter.instanceid}`}
                checked={filterConfig.all || false}
                onCheckedChange={(checked) => {
                  handleFilterChange('jaql.filter.all', checked);
                  if (checked) handleFilterChange('jaql.filter.explicit', false);
                }}
              />
              <label
                htmlFor={`all-${filter.instanceid}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Select All
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`primary-${filter.instanceid}`}
                checked={filter.jaql?.isPrimary || false}
                onCheckedChange={(checked) =>
                  handleFilterChange('jaql.isPrimary', Boolean(checked))
                }
              />
              <label
                htmlFor={`primary-${filter.instanceid}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Primary
              </label>
            </div>

            {filterConfig.explicit && !filterConfig.all && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Members{' '}
                  {datatype !== 'text' && (
                    <span className="text-gray-500 font-normal">({datatype})</span>
                  )}
                </label>
                <div className="space-y-2">
                  {filterConfig.members
                    ?.slice(0, filterConfig.multiSelection ? undefined : 1)
                    .map((member, index) => (
                      <div key={index} className="flex gap-2">
                        {renderMemberInput(member, index)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  <Button
                    onClick={addMember}
                    className="w-full"
                    disabled={
                      !filterConfig.multiSelection &&
                      !!filterConfig.members &&
                      filterConfig.members.length > 0
                    }
                  >
                    + Add Member
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-4 border-t">
              <Checkbox
                id={`disabled-${filter.instanceid}`}
                checked={filter.disabled || false}
                onCheckedChange={(checked) => {
                  onChange({ ...filter, disabled: Boolean(checked) });
                }}
              />
              <label
                htmlFor={`disabled-${filter.instanceid}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Disabled
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Cascading filter tile
  if (filter.isCascading && filter.levels) {
    return (
      <Card className="mb-6 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg">{title} (Cascading Filter)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filter.levels.map((level, index) => (
              <Card key={index} className="border-purple-200">
                <CardContent className="pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Level {index + 1}: {level.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Column:</span>{' '}
                      <span className="font-mono text-gray-900">{level.column}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Table:</span>{' '}
                      <span className="font-mono text-gray-900">{level.table}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex items-center space-x-2 pt-4 border-t border-purple-200">
              <Checkbox
                id={`disabled-cascade-${filter.instanceid}`}
                checked={filter.disabled || false}
                onCheckedChange={(checked) => {
                  onChange({ ...filter, disabled: Boolean(checked) });
                }}
              />
              <label
                htmlFor={`disabled-cascade-${filter.instanceid}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Disabled
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <p className="text-sm text-yellow-800">
          Unsupported filter structure for {filter.instanceid}
        </p>
      </CardContent>
    </Card>
  );
}
