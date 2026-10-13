import React from 'react';
import { ServicePricingCards } from './ServicePricingCards.js';
import { ServiceComparisonTable } from './ServiceComparisonTable.js';

interface ServicesSectionProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <>
      {/* SECTION 1: SERVICE PRICING CARDS */}
      <ServicePricingCards onSelectService={onSelectService} />

      {/* SECTION 2: SERVICE COMPARISON TABLE */}
      <ServiceComparisonTable onSelectService={onSelectService} />
    </>
  );
};
