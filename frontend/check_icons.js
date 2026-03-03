import * as Icons from 'lucide-react';

const iconsToCheck = [
    'Search', 'Car', 'MapPin', 'Calendar', 'DollarSign', 'Activity', 'AlertTriangle',
    'CheckCircle', 'CheckCircle2', 'XCircle', 'FileText', 'ExternalLink', 'Zap',
    'ShieldCheck', 'Clock', 'Info', 'Fuel', 'Gauge', 'Calculator', 'AlertCircle',
    'ArrowRight', 'Settings', 'Warehouse', 'Plus', 'Save', 'Share2', 'Mail',
    'Home', 'Menu', 'X', 'Eye', 'EyeOff', 'Sparkles', 'TrendingUp', 'TrendingDown',
    'Lock', 'ShieldAlert', 'Truck', 'Loader2', 'MessageCircle'
];

iconsToCheck.forEach(name => {
    if (!Icons[name]) {
        console.log(`MISSING ICON: ${name}`);
    } else {
        console.log(`OK: ${name}`);
    }
});
