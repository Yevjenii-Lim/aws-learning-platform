'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Eye, 
  Download,
  ArrowLeft,
  Cloud,
  Server,
  Database,
  Globe,
  Shield,
  HardDrive
} from 'lucide-react';
import Link from 'next/link';

interface AWSComponent {
  id: string;
  type: 'vpc' | 'ec2' | 'rds' | 's3' | 'alb' | 'security-group';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
  connections: string[];
}

interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'network' | 'security';
}

export default function ConstructorPage() {
  const [components, setComponents] = useState<AWSComponent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const componentTypes = [
    { type: 'vpc', name: 'VPC', icon: Cloud, color: 'bg-blue-500', description: 'Virtual Private Cloud' },
    { type: 'ec2', name: 'EC2', icon: Server, color: 'bg-green-500', description: 'Elastic Compute Cloud' },
    { type: 'rds', name: 'RDS', icon: Database, color: 'bg-purple-500', description: 'Relational Database' },
    { type: 's3', name: 'S3', icon: HardDrive, color: 'bg-orange-500', description: 'Simple Storage Service' },
    { type: 'alb', name: 'ALB', icon: Globe, color: 'bg-indigo-500', description: 'Application Load Balancer' },
    { type: 'security-group', name: 'Security Group', icon: Shield, color: 'bg-red-500', description: 'Security Group' },
  ];

  const addComponent = (type: string) => {
    const newComponent: AWSComponent = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      name: `${type.toUpperCase()} ${components.filter(c => c.type === type).length + 1}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: type === 'vpc' ? 300 : 120,
      height: type === 'vpc' ? 200 : 80,
      properties: getDefaultProperties(type),
      connections: [],
    };
    setComponents([...components, newComponent]);
  };

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'vpc':
        return {
          cidr: '10.0.0.0/16',
          subnets: [],
          internetGateway: false,
        };
      case 'ec2':
        return {
          instanceType: 't2.micro',
          ami: 'Amazon Linux 2023',
          keyPair: '',
        };
      case 'rds':
        return {
          engine: 'MySQL',
          instanceClass: 'db.t3.micro',
          storage: 20,
        };
      case 's3':
        return {
          bucketName: '',
          versioning: false,
          encryption: true,
        };
      case 'alb':
        return {
          scheme: 'internet-facing',
          targetGroups: [],
        };
      case 'security-group':
        return {
          rules: [],
          description: 'Security group rules',
        };
      default:
        return {};
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    if (connectionMode) {
      if (!connectionStart) {
        setConnectionStart(componentId);
      } else if (connectionStart !== componentId) {
        // Create connection
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          from: connectionStart,
          to: componentId,
          type: 'network',
        };
        setConnections([...connections, newConnection]);
        setConnectionStart(null);
        setConnectionMode(false);
      }
      return;
    }

    setIsDragging(true);
    setSelectedComponent(componentId);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - component.x,
        y: e.clientY - rect.top - component.y,
      });
    }
  }, [components, connectionMode, connectionStart, connections]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedComponent) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setComponents(prev => prev.map(comp => 
      comp.id === selectedComponent 
        ? { ...comp, x: Math.max(0, newX), y: Math.max(0, newY) }
        : comp
    ));
  }, [isDragging, selectedComponent, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelectedComponent(null);
  }, []);

  const deleteComponent = (componentId: string) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setConnections(prev => prev.filter(c => c.from !== componentId && c.to !== componentId));
  };

  const getComponentIcon = (type: string) => {
    const componentType = componentTypes.find(ct => ct.type === type);
    return componentType ? componentType.icon : Cloud;
  };

  const getComponentColor = (type: string) => {
    const componentType = componentTypes.find(ct => ct.type === type);
    return componentType ? componentType.color : 'bg-gray-500';
  };

  const exportArchitecture = () => {
    const architecture = {
      components,
      connections,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(architecture, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aws-architecture.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (templateName: string) => {
    const templates = {
      'web-app': {
        components: [
          {
            id: 'vpc-1',
            type: 'vpc' as const,
            name: 'Web App VPC',
            x: 200,
            y: 100,
            width: 400,
            height: 300,
            properties: { cidr: '10.0.0.0/16', subnets: [], internetGateway: true },
            connections: [],
          },
          {
            id: 'alb-1',
            type: 'alb' as const,
            name: 'Web Load Balancer',
            x: 250,
            y: 150,
            width: 120,
            height: 80,
            properties: { scheme: 'internet-facing', targetGroups: [] },
            connections: [],
          },
          {
            id: 'ec2-1',
            type: 'ec2' as const,
            name: 'Web Server 1',
            x: 300,
            y: 250,
            width: 120,
            height: 80,
            properties: { instanceType: 't2.micro', ami: 'Amazon Linux 2023', keyPair: '' },
            connections: [],
          },
          {
            id: 'ec2-2',
            type: 'ec2' as const,
            name: 'Web Server 2',
            x: 450,
            y: 250,
            width: 120,
            height: 80,
            properties: { instanceType: 't2.micro', ami: 'Amazon Linux 2023', keyPair: '' },
            connections: [],
          },
          {
            id: 'rds-1',
            type: 'rds' as const,
            name: 'Database',
            x: 350,
            y: 350,
            width: 120,
            height: 80,
            properties: { engine: 'MySQL', instanceClass: 'db.t3.micro', storage: 20 },
            connections: [],
          },
        ],
        connections: [
          { id: 'conn-1', from: 'alb-1', to: 'ec2-1', type: 'network' as const },
          { id: 'conn-2', from: 'alb-1', to: 'ec2-2', type: 'network' as const },
          { id: 'conn-3', from: 'ec2-1', to: 'rds-1', type: 'network' as const },
          { id: 'conn-4', from: 'ec2-2', to: 'rds-1', type: 'network' as const },
        ],
      },
      'data-pipeline': {
        components: [
          {
            id: 'vpc-1',
            type: 'vpc' as const,
            name: 'Data Pipeline VPC',
            x: 200,
            y: 100,
            width: 400,
            height: 300,
            properties: { cidr: '10.0.0.0/16', subnets: [], internetGateway: false },
            connections: [],
          },
          {
            id: 's3-1',
            type: 's3' as const,
            name: 'Raw Data Bucket',
            x: 100,
            y: 200,
            width: 120,
            height: 80,
            properties: { bucketName: 'raw-data-bucket', versioning: true, encryption: true },
            connections: [],
          },
          {
            id: 'ec2-1',
            type: 'ec2' as const,
            name: 'Processing Server',
            x: 300,
            y: 200,
            width: 120,
            height: 80,
            properties: { instanceType: 't3.medium', ami: 'Amazon Linux 2023', keyPair: '' },
            connections: [],
          },
          {
            id: 's3-2',
            type: 's3' as const,
            name: 'Processed Data Bucket',
            x: 500,
            y: 200,
            width: 120,
            height: 80,
            properties: { bucketName: 'processed-data-bucket', versioning: false, encryption: true },
            connections: [],
          },
        ],
        connections: [
          { id: 'conn-1', from: 's3-1', to: 'ec2-1', type: 'network' as const },
          { id: 'conn-2', from: 'ec2-1', to: 's3-2', type: 'network' as const },
        ],
      },
    };

    const template = templates[templateName as keyof typeof templates];
    if (template) {
      setComponents(template.components);
      setConnections(template.connections);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/games" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AWS Architecture Builder DEMO</h1>
                <p className="text-sm text-gray-600">Drag and drop to build your network</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setConnectionMode(!connectionMode)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  connectionMode 
                    ? 'bg-aws-orange text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="h-4 w-4 mr-2" />
                {connectionMode ? 'Cancel Connection' : 'Connect'}
              </button>
              <button
                onClick={exportArchitecture}
                className="aws-button-secondary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Component Palette */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Components</h3>
          
          <div className="space-y-2">
            {componentTypes.map((componentType) => {
              const Icon = componentType.icon;
              return (
                <button
                  key={componentType.type}
                  onClick={() => addComponent(componentType.type)}
                  className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-aws-orange hover:shadow-sm transition-all duration-200"
                >
                  <div className={`w-8 h-8 rounded-lg ${componentType.color} flex items-center justify-center text-white mr-3`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{componentType.name}</div>
                    <div className="text-xs text-gray-600">{componentType.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

                     {/* Templates */}
           <div className="mt-6">
             <h4 className="font-medium text-gray-900 mb-3">Templates</h4>
             <div className="space-y-2">
               <button
                 onClick={() => loadTemplate('web-app')}
                 className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-aws-orange hover:shadow-sm transition-all duration-200"
               >
                 <div className="font-medium text-gray-900">Web Application</div>
                 <div className="text-xs text-gray-600">VPC + ALB + EC2 + RDS</div>
               </button>
               <button
                 onClick={() => loadTemplate('data-pipeline')}
                 className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-aws-orange hover:shadow-sm transition-all duration-200"
               >
                 <div className="font-medium text-gray-900">Data Pipeline</div>
                 <div className="text-xs text-gray-600">VPC + S3 + EC2</div>
               </button>
             </div>
           </div>

           {/* Instructions */}
           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
             <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
             <ul className="text-sm text-blue-800 space-y-1">
               <li>• Click components to add them</li>
               <li>• Drag to move components</li>
               <li>• Use Connect mode to link components</li>
               <li>• Click settings to configure</li>
               <li>• Export your architecture</li>
             </ul>
           </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-100 relative"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Components */}
            {components.map((component) => {
              const Icon = getComponentIcon(component.type);
              const colorClass = getComponentColor(component.type);
              
              return (
                                 <motion.div
                   key={component.id}
                   className={`absolute cursor-move border-2 border-transparent hover:border-aws-orange transition-colors ${
                     selectedComponent === component.id ? 'border-aws-orange' : ''
                   } ${
                     connectionStart === component.id ? 'border-2 border-green-500' : ''
                   }`}
                  style={{
                    left: component.x,
                    top: component.y,
                    width: component.width,
                    height: component.height,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, component.id)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`w-full h-full ${colorClass} rounded-lg shadow-md flex flex-col`}>
                    {/* Component Header */}
                    <div className="flex items-center justify-between p-2 bg-white bg-opacity-20 rounded-t-lg">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 text-white mr-2" />
                        <span className="text-white text-sm font-medium">{component.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComponent(component.id);
                          }}
                          className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded"
                        >
                          <Settings className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteComponent(component.id);
                          }}
                          className="p-1 text-white hover:bg-red-500 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Component Content */}
                    <div className="flex-1 p-2">
                      <div className="text-white text-xs">
                        {component.type === 'vpc' && (
                          <div>
                            <div>CIDR: {component.properties.cidr}</div>
                            <div>Subnets: {component.properties.subnets.length}</div>
                          </div>
                        )}
                        {component.type === 'ec2' && (
                          <div>
                            <div>{component.properties.instanceType}</div>
                            <div>{component.properties.ami}</div>
                          </div>
                        )}
                        {component.type === 'rds' && (
                          <div>
                            <div>{component.properties.engine}</div>
                            <div>{component.properties.instanceClass}</div>
                          </div>
                        )}
                        {component.type === 's3' && (
                          <div>
                            <div>Bucket: {component.properties.bucketName || 'Unnamed'}</div>
                            <div>Encrypted: {component.properties.encryption ? 'Yes' : 'No'}</div>
                          </div>
                        )}
                        {component.type === 'alb' && (
                          <div>
                            <div>Scheme: {component.properties.scheme}</div>
                            <div>Targets: {component.properties.targetGroups.length}</div>
                          </div>
                        )}
                        {component.type === 'security-group' && (
                          <div>
                            <div>Rules: {component.properties.rules.length}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Connections */}
            {connections.map((connection) => {
              const fromComponent = components.find(c => c.id === connection.from);
              const toComponent = components.find(c => c.id === connection.to);
              
              if (!fromComponent || !toComponent) return null;
              
              const fromX = fromComponent.x + fromComponent.width / 2;
              const fromY = fromComponent.y + fromComponent.height / 2;
              const toX = toComponent.x + toComponent.width / 2;
              const toY = toComponent.y + toComponent.height / 2;
              
              return (
                <svg
                  key={connection.id}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke={connection.type === 'network' ? '#3b82f6' : '#ef4444'}
                    strokeWidth="2"
                    strokeDasharray={connection.type === 'security' ? "5,5" : "none"}
                  />
                </svg>
              );
            })}
          </div>

          {/* Empty State */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Building</h3>
                <p className="text-gray-600 mb-4">Drag components from the sidebar to create your AWS architecture</p>
                <div className="flex justify-center space-x-2">
                  {componentTypes.slice(0, 3).map((componentType) => {
                    const Icon = componentType.icon;
                    return (
                      <button
                        key={componentType.type}
                        onClick={() => addComponent(componentType.type)}
                        className={`p-3 rounded-lg ${componentType.color} text-white hover:opacity-80 transition-opacity`}
                      >
                        <Icon className="h-6 w-6" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedComponent && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Properties</h3>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {(() => {
              const component = components.find(c => c.id === selectedComponent);
              if (!component) return null;

              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={component.name}
                      onChange={(e) => {
                        setComponents(prev => prev.map(c => 
                          c.id === selectedComponent 
                            ? { ...c, name: e.target.value }
                            : c
                        ));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                    />
                  </div>

                  {component.type === 'vpc' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CIDR Block
                      </label>
                      <input
                        type="text"
                        value={component.properties.cidr}
                        onChange={(e) => {
                          setComponents(prev => prev.map(c => 
                            c.id === selectedComponent 
                              ? { ...c, properties: { ...c.properties, cidr: e.target.value } }
                              : c
                          ));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                        placeholder="10.0.0.0/16"
                      />
                    </div>
                  )}

                  {component.type === 'ec2' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instance Type
                      </label>
                      <select
                        value={component.properties.instanceType}
                        onChange={(e) => {
                          setComponents(prev => prev.map(c => 
                            c.id === selectedComponent 
                              ? { ...c, properties: { ...c.properties, instanceType: e.target.value } }
                              : c
                          ));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                      >
                        <option value="t2.micro">t2.micro</option>
                        <option value="t2.small">t2.small</option>
                        <option value="t2.medium">t2.medium</option>
                        <option value="t3.micro">t3.micro</option>
                        <option value="t3.small">t3.small</option>
                      </select>
                    </div>
                  )}

                  {component.type === 's3' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bucket Name
                      </label>
                      <input
                        type="text"
                        value={component.properties.bucketName}
                        onChange={(e) => {
                          setComponents(prev => prev.map(c => 
                            c.id === selectedComponent 
                              ? { ...c, properties: { ...c.properties, bucketName: e.target.value } }
                              : c
                          ));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                        placeholder="my-bucket-name"
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => deleteComponent(selectedComponent)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete Component
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
} 