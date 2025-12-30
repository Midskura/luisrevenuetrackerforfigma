import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  FileText,
  File,
  Image,
  Folder,
  Calendar,
  User,
  Filter,
  Grid3x3,
  List,
  Plus,
  MoreVertical,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "../data/mockData";

type DocumentsViewProps = {
  currentRole: UserRole;
};

type DocumentCategory = 'contracts' | 'receipts' | 'statements' | 'legal' | 'other';

type Document = {
  id: string;
  name: string;
  category: DocumentCategory;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  uploadedAt: string;
  unitNumber?: string;
  version?: number;
  description?: string;
};

export function DocumentsView({ currentRole }: DocumentsViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | DocumentCategory>('all');
  const [filterUnit, setFilterUnit] = useState<'all' | string>('all');

  const isReadOnly = currentRole === 'Encoder';

  // Mock documents
  const mockDocuments: Document[] = [
    {
      id: 'doc_001',
      name: 'Contract_B1-L05_Final.pdf',
      category: 'contracts',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Ana Martinez',
      uploadedByRole: 'Manager',
      uploadedAt: '2024-12-27T10:30:00',
      unitNumber: 'B1-L05',
      version: 2,
      description: 'Final signed contract with payment terms'
    },
    {
      id: 'doc_002',
      name: 'Receipt_B1-L05_Dec2024.pdf',
      category: 'receipts',
      type: 'PDF',
      size: '156 KB',
      uploadedBy: 'Juan Reyes',
      uploadedByRole: 'Encoder',
      uploadedAt: '2024-12-27T14:20:00',
      unitNumber: 'B1-L05',
      description: 'December 2024 monthly payment receipt'
    },
    {
      id: 'doc_003',
      name: 'SOA_B2-L12_Q4-2024.pdf',
      category: 'statements',
      type: 'PDF',
      size: '890 KB',
      uploadedBy: 'Ana Martinez',
      uploadedByRole: 'Manager',
      uploadedAt: '2024-12-26T16:45:00',
      unitNumber: 'B2-L12',
      description: 'Q4 2024 Statement of Account'
    },
    {
      id: 'doc_004',
      name: 'Contract_B2-L12_Final.pdf',
      category: 'contracts',
      type: 'PDF',
      size: '3.1 MB',
      uploadedBy: 'Ricardo Santos',
      uploadedByRole: 'Executive',
      uploadedAt: '2024-12-25T11:00:00',
      unitNumber: 'B2-L12',
      version: 1,
      description: 'Original signed contract'
    },
    {
      id: 'doc_005',
      name: 'Title_Deed_Template.docx',
      category: 'legal',
      type: 'DOCX',
      size: '450 KB',
      uploadedBy: 'Ricardo Santos',
      uploadedByRole: 'Executive',
      uploadedAt: '2024-12-24T09:15:00',
      description: 'Standard title deed template'
    },
    {
      id: 'doc_006',
      name: 'Receipt_B3-L08_Nov2024.pdf',
      category: 'receipts',
      type: 'PDF',
      size: '142 KB',
      uploadedBy: 'Juan Reyes',
      uploadedByRole: 'Encoder',
      uploadedAt: '2024-12-23T13:30:00',
      unitNumber: 'B3-L08',
      description: 'November 2024 payment receipt'
    },
    {
      id: 'doc_007',
      name: 'Contract_B3-L08_Final.pdf',
      category: 'contracts',
      type: 'PDF',
      size: '2.8 MB',
      uploadedBy: 'Ana Martinez',
      uploadedByRole: 'Manager',
      uploadedAt: '2024-12-22T15:20:00',
      unitNumber: 'B3-L08',
      version: 1,
      description: 'Final signed contract'
    },
    {
      id: 'doc_008',
      name: 'Property_Tax_Declaration.pdf',
      category: 'legal',
      type: 'PDF',
      size: '1.2 MB',
      uploadedBy: 'Ricardo Santos',
      uploadedByRole: 'Executive',
      uploadedAt: '2024-12-21T10:45:00',
      description: 'Tax declaration documents'
    },
    {
      id: 'doc_009',
      name: 'SOA_B1-L15_Q4-2024.pdf',
      category: 'statements',
      type: 'PDF',
      size: '780 KB',
      uploadedBy: 'Ana Martinez',
      uploadedByRole: 'Manager',
      uploadedAt: '2024-12-20T14:00:00',
      unitNumber: 'B1-L15',
      description: 'Q4 2024 Statement of Account'
    },
    {
      id: 'doc_010',
      name: 'Receipt_B2-L03_Dec2024.pdf',
      category: 'receipts',
      type: 'PDF',
      size: '165 KB',
      uploadedBy: 'Juan Reyes',
      uploadedByRole: 'Encoder',
      uploadedAt: '2024-12-23T11:10:00',
      unitNumber: 'B2-L03',
      description: 'December 2024 payment receipt'
    },
    {
      id: 'doc_011',
      name: 'Payment_Terms_Agreement.pdf',
      category: 'legal',
      type: 'PDF',
      size: '680 KB',
      uploadedBy: 'Ricardo Santos',
      uploadedByRole: 'Executive',
      uploadedAt: '2024-12-19T09:30:00',
      description: 'Standard payment terms agreement template'
    },
    {
      id: 'doc_012',
      name: 'Contract_B1-L15_Final.pdf',
      category: 'contracts',
      type: 'PDF',
      size: '2.9 MB',
      uploadedBy: 'Ana Martinez',
      uploadedByRole: 'Manager',
      uploadedAt: '2024-12-18T16:20:00',
      unitNumber: 'B1-L15',
      version: 1,
      description: 'Final signed contract'
    }
  ];

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'contracts':
        return FileText;
      case 'receipts':
        return File;
      case 'statements':
        return FileText;
      case 'legal':
        return File;
      default:
        return File;
    }
  };

  const getCategoryColor = (category: DocumentCategory) => {
    switch (category) {
      case 'contracts':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'receipts':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'statements':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'legal':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const handleUpload = () => {
    if (currentRole === 'Encoder' && filterCategory === 'legal') {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot upload legal documents'
      });
      return;
    }

    toast.success('Upload initiated', {
      description: 'This feature will be available in the full system'
    });
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.name}`, {
      description: `${doc.size} - ${doc.type} file`
    });
  };

  const handlePreview = (doc: Document) => {
    toast.info(`Opening ${doc.name}`, {
      description: 'Document preview will be available in the full system'
    });
  };

  const handleDelete = (doc: Document) => {
    if (currentRole !== 'Executive') {
      toast.error('Permission Denied', {
        description: 'Only Executives can delete documents'
      });
      return;
    }

    toast.success(`Deleted ${doc.name}`, {
      description: 'Document moved to trash'
    });
  };

  // Filter documents
  const filteredDocuments = mockDocuments.filter(doc => {
    // Search filter
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filterCategory !== 'all' && doc.category !== filterCategory) {
      return false;
    }

    // Unit filter
    if (filterUnit !== 'all' && doc.unitNumber !== filterUnit) {
      return false;
    }

    return true;
  });

  // Get unique units for filter
  const units = Array.from(new Set(mockDocuments.map(d => d.unitNumber).filter(Boolean))).sort();

  // Category stats
  const categoryStats = {
    contracts: mockDocuments.filter(d => d.category === 'contracts').length,
    receipts: mockDocuments.filter(d => d.category === 'receipts').length,
    statements: mockDocuments.filter(d => d.category === 'statements').length,
    legal: mockDocuments.filter(d => d.category === 'legal').length,
    other: mockDocuments.filter(d => d.category === 'other').length
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload, organize, and manage all project documents
          </p>
        </div>
        
        <Button
          onClick={handleUpload}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(['contracts', 'receipts', 'statements', 'legal', 'other'] as DocumentCategory[]).map((category) => {
          const colors = getCategoryColor(category);
          const Icon = getCategoryIcon(category);
          
          return (
            <Card
              key={category}
              className={`p-4 cursor-pointer transition-all ${
                filterCategory === category ? `${colors.bg} border-2 ${colors.border}` : 'hover:shadow-md'
              }`}
              onClick={() => setFilterCategory(filterCategory === category ? 'all' : category)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {categoryStats[category]}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">{category}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters & Search */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search documents by name, unit, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Unit Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Units</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredDocuments.length}</span> documents
          </div>
        </div>

        {filterCategory !== 'all' && (
          <div className="mt-4 flex items-center gap-2">
            <Badge className={`${getCategoryColor(filterCategory).bg} ${getCategoryColor(filterCategory).text} ${getCategoryColor(filterCategory).border}`}>
              {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}
            </Badge>
            <button
              onClick={() => setFilterCategory('all')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear filter
            </button>
          </div>
        )}
      </Card>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const colors = getCategoryColor(doc.category);
            const Icon = getCategoryIcon(doc.category);
            
            return (
              <Card key={doc.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
                        {doc.category}
                      </Badge>
                      {doc.unitNumber && (
                        <Badge variant="outline" className="text-xs">
                          {doc.unitNumber}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {doc.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {doc.description}
                  </p>
                )}

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium text-gray-900">{doc.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">{doc.type}</span>
                  </div>
                  {doc.version && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Version</span>
                      <span className="font-medium text-gray-900">v{doc.version}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-semibold">
                    {doc.uploadedBy.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate">{doc.uploadedBy}</p>
                    <p className="text-gray-500 text-xs">{formatTimestamp(doc.uploadedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(doc)}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  {currentRole === 'Executive' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="divide-y divide-gray-200">
          {filteredDocuments.map((doc) => {
            const colors = getCategoryColor(doc.category);
            const Icon = getCategoryIcon(doc.category);
            
            return (
              <div key={doc.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
                          {doc.category}
                        </Badge>
                        {doc.unitNumber && (
                          <Badge variant="outline" className="text-xs">
                            {doc.unitNumber}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-semibold">
                          {doc.uploadedBy.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{doc.uploadedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimestamp(doc.uploadedAt)}</span>
                      </div>
                      <span>{doc.size}</span>
                      <span>{doc.type}</span>
                      {doc.version && <span>v{doc.version}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(doc)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    {currentRole === 'Executive' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-sm text-gray-600 mb-4">
            Try adjusting your filters or search query
          </p>
          <Button
            onClick={handleUpload}
            className="bg-red-600 hover:bg-red-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload First Document
          </Button>
        </Card>
      )}
    </div>
  );
}
