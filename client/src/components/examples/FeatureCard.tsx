import { Shield } from 'lucide-react';
import { FeatureCard } from '../FeatureCard';

export default function FeatureCardExample() {
  return (
    <FeatureCard
      icon={Shield}
      title="100% Private"
      description="All compression happens in your browser. Your photos never leave your device."
    />
  );
}
