'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ArrowRight,
  Cloud,
  Server,
  Database,
  Globe,
  Shield,
  HardDrive,
  Zap,
  Users,
  Lock,
  BarChart3,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// AWS-style SVG icons
const AWSIcons = {
  vpc: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="6" width="20" height="12" rx="2" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <rect x="4" y="8" width="6" height="4" rx="1" fill="#232F3E"/>
      <rect x="12" y="8" width="6" height="4" rx="1" fill="#232F3E"/>
      <rect x="4" y="14" width="6" height="2" rx="1" fill="#232F3E"/>
      <rect x="12" y="14" width="6" height="2" rx="1" fill="#232F3E"/>
    </svg>
  ),
  ec2: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <rect x="5" y="6" width="14" height="8" rx="1" fill="#232F3E"/>
      <circle cx="7" cy="8" r="1" fill="#FF9900"/>
      <circle cx="10" cy="8" r="1" fill="#FF9900"/>
      <circle cx="13" cy="8" r="1" fill="#FF9900"/>
      <rect x="5" y="10" width="14" height="2" fill="#FF9900"/>
    </svg>
  ),
  rds: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <ellipse cx="12" cy="8" rx="8" ry="4" fill="#3F48CC" stroke="#232F3E" strokeWidth="1"/>
      <ellipse cx="12" cy="16" rx="8" ry="4" fill="#3F48CC" stroke="#232F3E" strokeWidth="1"/>
      <rect x="8" y="6" width="8" height="8" fill="#232F3E"/>
      <rect x="10" y="8" width="4" height="4" fill="#3F48CC"/>
    </svg>
  ),
  s3: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#3F48CC" stroke="#232F3E" strokeWidth="1"/>
      <rect x="4" y="6" width="16" height="2" fill="#232F3E"/>
      <rect x="4" y="10" width="16" height="2" fill="#232F3E"/>
      <rect x="4" y="14" width="16" height="2" fill="#232F3E"/>
      <circle cx="6" cy="7" r="0.5" fill="#3F48CC"/>
      <circle cx="6" cy="11" r="0.5" fill="#3F48CC"/>
      <circle cx="6" cy="15" r="0.5" fill="#3F48CC"/>
    </svg>
  ),
  alb: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="8" width="20" height="8" rx="2" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <rect x="4" y="10" width="4" height="4" fill="#232F3E"/>
      <rect x="10" y="10" width="4" height="4" fill="#232F3E"/>
      <rect x="16" y="10" width="4" height="4" fill="#232F3E"/>
      <path d="M12 4 L12 8 M8 6 L16 6" stroke="#232F3E" strokeWidth="2" fill="none"/>
    </svg>
  ),
  lambda: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M3 20 L21 4 L21 20 Z" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <path d="M7 16 L15 8 L15 16 Z" fill="#232F3E"/>
      <path d="M9 14 L13 10 L13 14 Z" fill="#FF9900"/>
    </svg>
  ),
  'api-gateway': () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="6" width="20" height="12" rx="2" fill="#3F48CC" stroke="#232F3E" strokeWidth="1"/>
      <rect x="4" y="8" width="16" height="2" fill="#232F3E"/>
      <rect x="4" y="12" width="16" height="2" fill="#232F3E"/>
      <rect x="4" y="16" width="16" height="2" fill="#232F3E"/>
      <circle cx="6" cy="9" r="0.5" fill="#3F48CC"/>
      <circle cx="6" cy="13" r="0.5" fill="#3F48CC"/>
      <circle cx="6" cy="17" r="0.5" fill="#3F48CC"/>
    </svg>
  ),
  cloudfront: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="10" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <path d="M8 8 L16 8 L16 16 L8 16 Z" fill="#232F3E"/>
      <path d="M10 10 L14 10 L14 14 L10 14 Z" fill="#FF9900"/>
      <circle cx="12" cy="12" r="1" fill="#232F3E"/>
    </svg>
  ),
  route53: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#3F48CC" stroke="#232F3E" strokeWidth="1"/>
      <path d="M6 8 L18 8 M6 12 L18 12 M6 16 L18 16" stroke="#232F3E" strokeWidth="2"/>
      <circle cx="8" cy="8" r="1" fill="#3F48CC"/>
      <circle cx="8" cy="12" r="1" fill="#3F48CC"/>
      <circle cx="8" cy="16" r="1" fill="#3F48CC"/>
    </svg>
  ),
  elasticache: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="6" width="20" height="12" rx="2" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <rect x="4" y="8" width="16" height="8" fill="#232F3E"/>
      <rect x="6" y="10" width="12" height="4" fill="#FF9900"/>
      <rect x="6" y="16" width="12" height="2" fill="#FF9900"/>
    </svg>
  ),
  sqs: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#3F48CC" stroke="#232F3E" strokeWidth="1"/>
      <rect x="4" y="6" width="16" height="2" fill="#232F3E"/>
      <rect x="4" y="10" width="16" height="2" fill="#232F3E"/>
      <rect x="4" y="14" width="16" height="2" fill="#232F3E"/>
      <rect x="4" y="18" width="16" height="2" fill="#232F3E"/>
    </svg>
  ),
  sns: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="6" width="20" height="12" rx="2" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <path d="M8 10 L16 10 M8 14 L16 14 M8 18 L16 18" stroke="#232F3E" strokeWidth="2"/>
      <circle cx="10" cy="10" r="1" fill="#232F3E"/>
      <circle cx="10" cy="14" r="1" fill="#232F3E"/>
      <circle cx="10" cy="18" r="1" fill="#232F3E"/>
    </svg>
  ),
  cloudwatch: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#3F48CC" stroke="#232F3E" strokeWidth="1"/>
      <path d="M6 8 L10 12 L14 8 L18 12" stroke="#FF9900" strokeWidth="2" fill="none"/>
      <circle cx="6" cy="8" r="1" fill="#FF9900"/>
      <circle cx="10" cy="12" r="1" fill="#FF9900"/>
      <circle cx="14" cy="8" r="1" fill="#FF9900"/>
      <circle cx="18" cy="12" r="1" fill="#FF9900"/>
    </svg>
  ),
  'security-group': () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="6" width="20" height="12" rx="2" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <path d="M8 10 L16 10 M8 14 L16 14" stroke="#232F3E" strokeWidth="2"/>
      <circle cx="10" cy="10" r="1" fill="#232F3E"/>
      <circle cx="10" cy="14" r="1" fill="#232F3E"/>
      <path d="M12 4 L12 6 M8 4 L16 4" stroke="#232F3E" strokeWidth="2"/>
    </svg>
  ),
  'public-subnet': () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#90EE90" stroke="#228B22" strokeWidth="1"/>
      <path d="M6 8 L18 8 M6 12 L18 12 M6 16 L18 16" stroke="#228B22" strokeWidth="1"/>
      <circle cx="8" cy="8" r="1" fill="#228B22"/>
      <circle cx="8" cy="12" r="1" fill="#228B22"/>
      <circle cx="8" cy="16" r="1" fill="#228B22"/>
    </svg>
  ),
  'private-subnet': () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#87CEEB" stroke="#4682B4" strokeWidth="1"/>
      <path d="M6 8 L18 8 M6 12 L18 12 M6 16 L18 16" stroke="#4682B4" strokeWidth="1"/>
      <circle cx="8" cy="8" r="1" fill="#4682B4"/>
      <circle cx="8" cy="12" r="1" fill="#4682B4"/>
      <circle cx="8" cy="16" r="1" fill="#4682B4"/>
    </svg>
  ),
  'internet-gateway': () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M3 12 L21 12 M12 3 L12 21 M6 6 L18 18 M18 6 L6 18" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3" fill="#8B5CF6"/>
      <path d="M9 9 L15 15 M15 9 L9 15" stroke="#8B5CF6" strokeWidth="1"/>
    </svg>
  ),
  'nat-gateway': () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="#8B5CF6" stroke="#232F3E" strokeWidth="1"/>
      <path d="M8 10 L16 10 M8 14 L16 14" stroke="#232F3E" strokeWidth="2"/>
      <circle cx="10" cy="10" r="1" fill="#232F3E"/>
      <circle cx="10" cy="14" r="1" fill="#232F3E"/>
      <path d="M12 4 L12 6 M8 4 L16 4" stroke="#232F3E" strokeWidth="2"/>
    </svg>
  ),
  'bastion-server': () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#FF9900" stroke="#232F3E" strokeWidth="1"/>
      <rect x="5" y="6" width="14" height="8" fill="#232F3E"/>
      <circle cx="7" cy="8" r="1" fill="#FF9900"/>
      <circle cx="10" cy="8" r="1" fill="#FF9900"/>
      <circle cx="13" cy="8" r="1" fill="#FF9900"/>
      <rect x="5" y="10" width="14" height="2" fill="#FF9900"/>
    </svg>
  )
};
import Link from 'next/link';

interface AWSComponent {
  id: string;
  type: 'vpc' | 'ec2' | 'rds' | 's3' | 'alb' | 'security-group' | 'lambda' | 'api-gateway' | 'cloudfront' | 'route53' | 'elasticache' | 'sqs' | 'sns' | 'cloudwatch' | 'public-subnet' | 'private-subnet' | 'internet-gateway' | 'nat-gateway' | 'bastion-server';
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
  type: 'network' | 'security' | 'data' | 'api';
}

interface ArchitectureExample {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  components: AWSComponent[];
  connections: Connection[];
  useCase: string;
  benefits: string[];
  estimatedCost: string;
  bestPractices: string[];
}

export default function ArchitectureExamplesPage() {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const componentTypes = [
    { type: 'vpc', name: 'VPC', icon: AWSIcons.vpc, color: 'bg-purple-500', description: 'Virtual Private Cloud' },
    { type: 'public-subnet', name: 'Public Subnet', icon: AWSIcons['public-subnet'], color: 'bg-green-200', description: 'Public Subnet' },
    { type: 'private-subnet', name: 'Private Subnet', icon: AWSIcons['private-subnet'], color: 'bg-blue-200', description: 'Private Subnet' },
    { type: 'internet-gateway', name: 'Internet Gateway', icon: AWSIcons['internet-gateway'], color: 'bg-purple-500', description: 'Internet Gateway' },
    { type: 'nat-gateway', name: 'NAT Gateway', icon: AWSIcons['nat-gateway'], color: 'bg-purple-500', description: 'NAT Gateway' },
    { type: 'bastion-server', name: 'Bastion Server', icon: AWSIcons['bastion-server'], color: 'bg-orange-500', description: 'Bastion Server' },
    { type: 'ec2', name: 'EC2', icon: AWSIcons.ec2, color: 'bg-orange-500', description: 'Elastic Compute Cloud' },
    { type: 'rds', name: 'RDS', icon: AWSIcons.rds, color: 'bg-blue-600', description: 'Relational Database' },
    { type: 's3', name: 'S3', icon: AWSIcons.s3, color: 'bg-blue-600', description: 'Simple Storage Service' },
    { type: 'alb', name: 'ALB', icon: AWSIcons.alb, color: 'bg-orange-500', description: 'Application Load Balancer' },
    { type: 'security-group', name: 'Security Group', icon: AWSIcons['security-group'], color: 'bg-red-500', description: 'Security Group' },
    { type: 'lambda', name: 'Lambda', icon: AWSIcons.lambda, color: 'bg-orange-500', description: 'Serverless Functions' },
    { type: 'api-gateway', name: 'API Gateway', icon: AWSIcons['api-gateway'], color: 'bg-blue-600', description: 'API Management' },
    { type: 'cloudfront', name: 'CloudFront', icon: AWSIcons.cloudfront, color: 'bg-orange-500', description: 'Content Delivery Network' },
    { type: 'route53', name: 'Route 53', icon: AWSIcons.route53, color: 'bg-blue-600', description: 'DNS Service' },
    { type: 'elasticache', name: 'ElastiCache', icon: AWSIcons.elasticache, color: 'bg-orange-500', description: 'In-Memory Cache' },
    { type: 'sqs', name: 'SQS', icon: AWSIcons.sqs, color: 'bg-blue-600', description: 'Message Queue' },
    { type: 'sns', name: 'SNS', icon: AWSIcons.sns, color: 'bg-orange-500', description: 'Notification Service' },
    { type: 'cloudwatch', name: 'CloudWatch', icon: AWSIcons.cloudwatch, color: 'bg-blue-600', description: 'Monitoring' },
  ];

  const architectureExamples: ArchitectureExample[] = [
    {
      id: 'vpc-lab',
      title: 'Lab VPC with Public and Private Subnets',
      description: 'A complete VPC setup with public and private subnets, Internet Gateway, NAT Gateway, and Bastion Server',
      category: 'Networking',
      difficulty: 'Beginner',
      useCase: 'Secure web applications with database connectivity and controlled internet access',
      benefits: ['Secure network isolation', 'Controlled internet access', 'High availability', 'Cost-effective'],
      estimatedCost: '$50-120/month',
      bestPractices: [
        'Use NAT Gateway for private subnet internet access',
        'Bastion server for secure SSH access',
        'Separate public and private subnets',
        'Configure route tables properly'
      ],
      components: [
        {
          id: 'aws-cloud',
          type: 'vpc',
          name: 'AWS Cloud',
          x: 50,
          y: 50,
          width: 1000,
          height: 600,
          properties: { cidr: '10.0.0.0/16', subnets: ['10.0.0.0/24', '10.0.2.0/23'], internetGateway: true },
          connections: [],
        },
        {
          id: 'lab-vpc',
          type: 'vpc',
          name: 'Lab VPC – 10.0.0.0/16',
          x: 100,
          y: 100,
          width: 900,
          height: 500,
          properties: { cidr: '10.0.0.0/16', subnets: ['10.0.0.0/24', '10.0.2.0/23'], internetGateway: true },
          connections: [],
        },
        {
          id: 'az-1',
          type: 'vpc',
          name: 'Availability Zone',
          x: 150,
          y: 150,
          width: 800,
          height: 400,
          properties: { cidr: '10.0.0.0/16', subnets: ['10.0.0.0/24', '10.0.2.0/23'], internetGateway: true },
          connections: [],
        },
        {
          id: 'public-subnet',
          type: 'public-subnet',
          name: 'Public Subnet 10.0.0.0/24',
          x: 200,
          y: 200,
          width: 700,
          height: 150,
          properties: { cidr: '10.0.0.0/24', routeTable: 'Public Route Table', internetGateway: true },
          connections: [],
        },
        {
          id: 'private-subnet',
          type: 'private-subnet',
          name: 'Private subnet 10.0.2.0/23',
          x: 200,
          y: 370,
          width: 700,
          height: 150,
          properties: { cidr: '10.0.2.0/23', routeTable: 'Private Route Table', natGateway: true },
          connections: [],
        },
        {
          id: 'internet-gateway',
          type: 'internet-gateway',
          name: 'Internet gateway',
          x: 500,
          y: 120,
          width: 180,
          height: 80,
          properties: { type: 'Internet Gateway', state: 'Attached' },
          connections: [],
        },
        {
          id: 'bastion-server',
          type: 'bastion-server',
          name: 'Bastion Server',
          x: 300,
          y: 250,
          width: 180,
          height: 100,
          properties: { instanceType: 't3.micro', ami: 'Amazon Linux 2023', keyPair: 'bastion-key' },
          connections: [],
        },
        {
          id: 'nat-gateway',
          type: 'nat-gateway',
          name: 'NAT Gateway',
          x: 600,
          y: 250,
          width: 180,
          height: 100,
          properties: { type: 'NAT Gateway', state: 'Available', elasticIp: 'eip-12345' },
          connections: [],
        },
        {
          id: 'private-instance',
          type: 'ec2',
          name: 'Private Instance',
          x: 300,
          y: 420,
          width: 180,
          height: 100,
          properties: { instanceType: 't3.micro', ami: 'Amazon Linux 2023', keyPair: 'private-key' },
          connections: [],
        },
      ],
      connections: [
        { id: 'conn-1', from: 'internet-gateway', to: 'nat-gateway', type: 'network' },
        { id: 'conn-2', from: 'private-instance', to: 'nat-gateway', type: 'network' },
      ],
    },
    {
      id: 'serverless-api',
      title: 'Serverless API with Lambda',
      description: 'A fully serverless API using Lambda, API Gateway, and DynamoDB',
      category: 'Serverless',
      difficulty: 'Intermediate',
      useCase: 'APIs with variable traffic patterns, cost optimization',
      benefits: ['Pay per request', 'Auto-scaling', 'No server management', 'High availability'],
      estimatedCost: '$10-100/month',
      bestPractices: [
        'Use Lambda layers for dependencies',
        'Implement proper error handling',
        'Use DynamoDB for fast queries',
        'Enable API Gateway caching'
      ],
        components: [
          {
          id: 'api-gateway-1',
          type: 'api-gateway',
          name: 'API Gateway',
          x: 300,
          y: 100,
          width: 180,
          height: 100,
          properties: { restApi: true, caching: true, throttling: true },
          connections: [],
        },
        {
          id: 'lambda-1',
          type: 'lambda',
          name: 'User Service',
            x: 200,
          y: 200,
          width: 180,
          height: 100,
          properties: { runtime: 'Node.js 18', memory: 256, timeout: 30 },
            connections: [],
          },
          {
          id: 'lambda-2',
          type: 'lambda',
          name: 'Product Service',
          x: 400,
            y: 200,
            width: 180,
            height: 100,
          properties: { runtime: 'Node.js 18', memory: 256, timeout: 30 },
          connections: [],
        },
        {
          id: 'dynamodb-1',
          type: 'rds',
          name: 'DynamoDB',
          x: 300,
          y: 300,
          width: 180,
          height: 100,
          properties: { tableType: 'DynamoDB', billingMode: 'On-Demand' },
          connections: [],
        },
      ],
      connections: [
        { id: 'conn-1', from: 'api-gateway-1', to: 'lambda-1', type: 'api' },
        { id: 'conn-2', from: 'api-gateway-1', to: 'lambda-2', type: 'api' },
        { id: 'conn-3', from: 'lambda-1', to: 'dynamodb-1', type: 'data' },
        { id: 'conn-4', from: 'lambda-2', to: 'dynamodb-1', type: 'data' },
      ],
    },
    {
      id: 'microservices',
      title: 'Microservices Architecture',
      description: 'A complex microservices architecture with service discovery and monitoring',
      category: 'Microservices',
      difficulty: 'Advanced',
      useCase: 'Large-scale applications with multiple teams and services',
      benefits: ['Independent scaling', 'Technology diversity', 'Fault isolation', 'Team autonomy'],
      estimatedCost: '$200-1000/month',
      bestPractices: [
        'Implement circuit breakers',
        'Use service mesh for communication',
        'Implement distributed tracing',
        'Design for failure'
      ],
      components: [
        {
          id: 'vpc-1',
          type: 'vpc',
          name: 'Microservices VPC',
          x: 100,
          y: 50,
          width: 600,
          height: 400,
          properties: { cidr: '10.0.0.0/16', subnets: ['10.0.1.0/24', '10.0.2.0/24', '10.0.3.0/24'], internetGateway: true },
          connections: [],
        },
        {
          id: 'alb-1',
          type: 'alb',
          name: 'API Gateway',
          x: 200,
          y: 120,
          width: 120,
          height: 80,
          properties: { scheme: 'internet-facing', targetGroups: ['user-service', 'order-service'] },
            connections: [],
          },
          {
            id: 'ec2-1',
          type: 'ec2',
          name: 'User Service',
          x: 150,
          y: 220,
          width: 120,
          height: 80,
          properties: { instanceType: 't3.small', ami: 'Amazon Linux 2023', keyPair: 'micro-key' },
          connections: [],
        },
        {
          id: 'ec2-2',
          type: 'ec2',
          name: 'Order Service',
          x: 300,
          y: 220,
          width: 120,
          height: 80,
          properties: { instanceType: 't3.small', ami: 'Amazon Linux 2023', keyPair: 'micro-key' },
          connections: [],
        },
        {
          id: 'ec2-3',
          type: 'ec2',
          name: 'Payment Service',
          x: 450,
          y: 220,
          width: 120,
          height: 80,
          properties: { instanceType: 't3.small', ami: 'Amazon Linux 2023', keyPair: 'micro-key' },
          connections: [],
        },
        {
          id: 'rds-1',
          type: 'rds',
          name: 'User DB',
          x: 150,
          y: 320,
          width: 120,
          height: 80,
          properties: { engine: 'PostgreSQL', instanceClass: 'db.t3.micro', storage: 20 },
          connections: [],
        },
        {
          id: 'rds-2',
          type: 'rds',
          name: 'Order DB',
            x: 300,
          y: 320,
            width: 120,
            height: 80,
          properties: { engine: 'MySQL', instanceClass: 'db.t3.micro', storage: 20 },
            connections: [],
          },
          {
          id: 'elasticache-1',
          type: 'elasticache',
          name: 'Redis Cache',
          x: 450,
          y: 320,
            width: 120,
            height: 80,
          properties: { engine: 'Redis', nodeType: 'cache.t3.micro' },
            connections: [],
          },
        ],
        connections: [
        { id: 'conn-1', from: 'alb-1', to: 'ec2-1', type: 'network' },
        { id: 'conn-2', from: 'alb-1', to: 'ec2-2', type: 'network' },
        { id: 'conn-3', from: 'ec2-1', to: 'rds-1', type: 'data' },
        { id: 'conn-4', from: 'ec2-2', to: 'rds-2', type: 'data' },
        { id: 'conn-5', from: 'ec2-2', to: 'ec2-3', type: 'api' },
        { id: 'conn-6', from: 'ec2-3', to: 'elasticache-1', type: 'data' },
      ],
    },
  ];

  const currentExample = architectureExamples[currentExampleIndex];

  const nextExample = () => {
    setCurrentExampleIndex((prev) => (prev + 1) % architectureExamples.length);
    setSelectedComponent(null);
  };

  const prevExample = () => {
    setCurrentExampleIndex((prev) => (prev - 1 + architectureExamples.length) % architectureExamples.length);
    setSelectedComponent(null);
  };

  const getComponentIcon = (type: string) => {
    const componentType = componentTypes.find(ct => ct.type === type);
    return componentType ? componentType.icon : AWSIcons.vpc;
  };

  const getComponentColor = (type: string) => {
    const componentType = componentTypes.find(ct => ct.type === type);
    return componentType ? componentType.color : 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <h1 className="text-xl font-semibold text-gray-900">AWS Architecture Examples</h1>
                <p className="text-sm text-gray-600">Explore real-world AWS infrastructure patterns</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
              <button
                  onClick={prevExample}
                  className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  disabled={architectureExamples.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
              </button>
                <span className="text-sm text-gray-600">
                  {currentExampleIndex + 1} of {architectureExamples.length}
                </span>
              <button
                  onClick={nextExample}
                  className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  disabled={architectureExamples.length <= 1}
              >
                  <ChevronRight className="h-4 w-4" />
              </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Architecture Info */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExample.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Architecture Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{currentExample.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentExample.difficulty)}`}>
                    {currentExample.difficulty}
                  </span>
                </div>
                <p className="text-gray-700 font-medium text-sm mb-3">{currentExample.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{currentExample.category}</span>
                </div>
                  </div>

              {/* Use Case */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center text-base">
                  <Info className="h-4 w-4 mr-2" />
                  Use Case
                </h3>
                <p className="text-sm font-medium text-gray-700">{currentExample.useCase}</p>
                  </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2 text-base">Benefits</h3>
                <ul className="space-y-1">
                  {currentExample.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm font-medium text-gray-700 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
          </div>

              {/* Estimated Cost */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Estimated Cost</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 font-medium">{currentExample.estimatedCost}</p>
                  <p className="text-green-600 text-xs mt-1">Based on typical usage patterns</p>
             </div>
           </div>

              {/* Best Practices */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
                <ul className="space-y-2">
                  {currentExample.bestPractices.map((practice, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      {practice}
                    </li>
                  ))}
             </ul>
           </div>

              {/* Components List */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Components</h3>
                <div className="space-y-2">
                  {currentExample.components.map((component) => {
                    const Icon = getComponentIcon(component.type);
                    const colorClass = getComponentColor(component.type);
                    return (
                      <div
                        key={component.id}
                        className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                          selectedComponent === component.id 
                            ? 'border-aws-orange bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
                      >
                        <div className={`w-6 h-6 rounded ${colorClass} flex items-center justify-center text-white mr-3`}>
                          <div className="h-3 w-3">
                            <Icon />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-sm">{component.name}</div>
                          <div className="text-xs font-medium text-gray-600">{component.type.toUpperCase()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main Canvas - Architecture Visualization */}
        <div className="flex-1 relative overflow-auto bg-gray-50">
          <div className="w-full h-full relative p-8 min-h-[1000px] min-w-[1200px]">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentExample.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                {/* Architecture Components */}
                {currentExample.components.map((component) => {
              const Icon = getComponentIcon(component.type);
              const colorClass = getComponentColor(component.type);
              
              return (
                                 <motion.div
                   key={component.id}
                      className={`absolute border-2 transition-all duration-300 ${
                        selectedComponent === component.id 
                          ? 'border-aws-orange shadow-lg scale-105' 
                          : 'border-transparent hover:border-gray-300'
                   }`}
                  style={{
                    left: component.x,
                    top: component.y,
                    width: component.width,
                    height: component.height,
                  }}
                      onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className={`w-full h-full rounded-lg shadow-md flex flex-col cursor-pointer ${
                        component.type === 'vpc' ? 'border-2 border-dashed border-purple-400 bg-purple-50' : 
                        component.type === 'public-subnet' ? 'border-2 border-green-400 bg-green-100' : 
                        component.type === 'private-subnet' ? 'border-2 border-blue-400 bg-blue-100' : 
                        component.type === 'security-group' ? 'border-2 border-red-400 bg-red-50' : 
                        `${colorClass}`
                      }`}>
                    {/* Component Header */}
                        <div className={`flex items-center justify-between p-2 rounded-t-lg overflow-hidden ${
                          component.type === 'vpc' ? 'bg-purple-100' :
                          component.type === 'public-subnet' ? 'bg-green-200' :
                          component.type === 'private-subnet' ? 'bg-blue-200' :
                          component.type === 'security-group' ? 'bg-red-100' :
                          'bg-white bg-opacity-20'
                        }`}>
                      <div className="flex items-center flex-1 min-w-0">
                            <div className={`h-4 w-4 mr-2 flex-shrink-0 ${
                              component.type === 'vpc' ? 'text-purple-600' :
                              component.type === 'public-subnet' ? 'text-green-700' :
                              component.type === 'private-subnet' ? 'text-blue-700' :
                              component.type === 'security-group' ? 'text-red-600' :
                              'text-white'
                            }`}>
                              <Icon />
                      </div>
                            <span className={`text-base font-bold flex-1 ${
                              component.type === 'vpc' ? 'text-purple-900' :
                              component.type === 'public-subnet' ? 'text-green-900' :
                              component.type === 'private-subnet' ? 'text-blue-900' :
                              component.type === 'security-group' ? 'text-red-900' :
                              'text-white'
                            }`}>{component.name}</span>
                      </div>
                    </div>
                    
                    {/* Component Content */}
                    <div className="flex-1 p-2 overflow-hidden">
                          <div className={`text-sm font-medium ${
                            component.type === 'vpc' ? 'text-purple-800' :
                            component.type === 'public-subnet' ? 'text-green-800' :
                            component.type === 'private-subnet' ? 'text-blue-800' :
                            component.type === 'security-group' ? 'text-red-800' :
                            'text-white'
                          }`}>
                            {component.type === 'vpc' && (
                              <div>
                                <div>VPC</div>
                              </div>
                            )}
                            {component.type === 'public-subnet' && (
                              <div>
                                <div>Public Subnet</div>
                              </div>
                            )}
                            {component.type === 'private-subnet' && (
                              <div>
                                <div>Private Subnet</div>
                              </div>
                            )}
                            {component.type === 'internet-gateway' && (
                              <div>
                                <div>Internet Gateway</div>
                              </div>
                            )}
                            {component.type === 'nat-gateway' && (
                              <div>
                                <div>NAT Gateway</div>
                              </div>
                            )}
                            {component.type === 'bastion-server' && (
                              <div>
                                <div>Bastion Server</div>
                              </div>
                            )}
                            {component.type === 'security-group' && (
                              <div>
                                <div>Security Group</div>
                              </div>
                            )}
                        {component.type === 'ec2' && (
                          <div>
                                <div>EC2 Instance</div>
                          </div>
                        )}
                        {component.type === 'rds' && (
                          <div>
                                <div>RDS Database</div>
                          </div>
                        )}
                        {component.type === 's3' && (
                          <div>
                            <div>S3 Bucket</div>
                          </div>
                        )}
                        {component.type === 'alb' && (
                          <div>
                            <div>Load Balancer</div>
                          </div>
                        )}
                            {component.type === 'lambda' && (
                              <div>
                                <div>Lambda Function</div>
                              </div>
                            )}
                            {component.type === 'api-gateway' && (
                              <div>
                                <div>API Gateway</div>
                              </div>
                            )}
                            {component.type === 'elasticache' && (
                          <div>
                                <div>ElastiCache</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Connections */}
                {currentExample.connections.map((connection) => {
                  const fromComponent = currentExample.components.find(c => c.id === connection.from);
                  const toComponent = currentExample.components.find(c => c.id === connection.to);
              
              if (!fromComponent || !toComponent) return null;
              
              const fromX = fromComponent.x + fromComponent.width / 2;
              const fromY = fromComponent.y + fromComponent.height / 2;
              const toX = toComponent.x + toComponent.width / 2;
              const toY = toComponent.y + toComponent.height / 2;
                  
                  const getConnectionColor = (type: string) => {
                    switch (type) {
                      case 'network': return '#3b82f6';
                      case 'data': return '#10b981';
                      case 'api': return '#f59e0b';
                      case 'security': return '#ef4444';
                      default: return '#6b7280';
                    }
                  };
              
              return (
                    <motion.svg
                  key={connection.id}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                        stroke={getConnectionColor(connection.type)}
                        strokeWidth="3"
                        strokeDasharray={connection.type === 'security' ? "8,4" : "none"}
                        opacity="0.8"
                      />
                      {/* Connection type indicator */}
                      <circle
                        cx={(fromX + toX) / 2}
                        cy={(fromY + toY) / 2}
                        r="4"
                        fill={getConnectionColor(connection.type)}
                        opacity="0.9"
                      />
                    </motion.svg>
              );
            })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Component Details Panel */}
        {selectedComponent && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Component Details</h3>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {(() => {
              const component = currentExample.components.find(c => c.id === selectedComponent);
              if (!component) return null;

              const Icon = getComponentIcon(component.type);
              const colorClass = getComponentColor(component.type);

              return (
                <div className="space-y-6">
                  {/* Component Header */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center text-white`}>
                      <div className="h-6 w-6">
                        <Icon />
                      </div>
                  </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{component.name}</h4>
                      <p className="text-sm font-medium text-gray-700">{component.type.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Properties */}
                    <div>
                    <h5 className="font-bold text-gray-900 mb-3 text-base">Configuration</h5>
                    <div className="space-y-3">
                      {Object.entries(component.properties).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {Array.isArray(value) ? value.length : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connections */}
                    <div>
                    <h5 className="font-bold text-gray-900 mb-3 text-base">Connections</h5>
                    <div className="space-y-2">
                      {currentExample.connections
                        .filter(conn => conn.from === component.id || conn.to === component.id)
                        .map((connection) => {
                          const connectedComponent = currentExample.components.find(
                            c => c.id === (connection.from === component.id ? connection.to : connection.from)
                          );
                          if (!connectedComponent) return null;
                          
                          const ConnectedIcon = getComponentIcon(connectedComponent.type);
                          const connectedColorClass = getComponentColor(connectedComponent.type);
                          
                          return (
                            <div key={connection.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                              <div className={`w-6 h-6 rounded ${connectedColorClass} flex items-center justify-center text-white`}>
                                <div className="h-3 w-3">
                                  <ConnectedIcon />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">{connectedComponent.name}</p>
                                <p className="text-xs font-medium text-gray-600">{connection.type} connection</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Component Description */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Description</h5>
                    <p className="text-sm text-gray-600">
                      {componentTypes.find(ct => ct.type === component.type)?.description || 
                       'AWS service component in this architecture.'}
                    </p>
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