import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Switch,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Home as HomeIcon,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  User as UserRound,
  Wrench,
  Camera,
  MessageCircle,
  Calendar as CalendarDays,
  Lock as LockKeyhole,
  Zap,
  Droplets,
  Refrigerator,
  Hammer,
  Paintbrush,
  Bug,
  Snowflake,
  Armchair,
  Cpu,
  Navigation,
  RotateCcw,
  Clock as Clock3,
  Star,
  Target,
  X,
  HelpCircle,
  Phone,
  Upload,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  LogOut,
  Share2,
  FileText,
  Sliders,
} from 'lucide-react-native';
import {
  categories,
  searchResults,
  savedAddresses as mockAddresses,
  initialBookings,
  faqCategories,
  popularFaqs,
  popularCities,
  recentLocations,
} from '@/src/data/mock';
import { colors, radius, spacing, typography } from '@/src/theme';

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'otp'
  | 'location'
  | 'home'
  | 'categories'
  | 'serviceDetails'
  | 'search'
  | 'bookRequirements'
  | 'bookMedia'
  | 'bookAddress'
  | 'bookSchedule'
  | 'bookConfirm'
  | 'providerStatus'
  | 'liveTracking'
  | 'bookingSuccess'
  | 'myBookings'
  | 'bookingDetails'
  | 'rescheduleBooking'
  | 'cancelBooking'
  | 'cancellationRefund'
  | 'profile'
  | 'editProfile'
  | 'savedAddresses'
  | 'paymentMethods'
  | 'helpSupport'
  | 'raiseComplaint'
  | 'rateReview';

// ─── ICON HELPERS ─────────────────────────────────────────────────────────────
const iconRegistry: Record<string, React.ComponentType<any>> = {
  Zap,
  Droplets,
  Refrigerator,
  Sparkles,
  Hammer,
  Paintbrush,
  Bug,
  Snowflake,
  Armchair,
  Cpu,
  CalendarDays,
  CreditCard,
  RotateCcw,
  Wrench,
};

function renderDynamicIcon(name: string, size = 20, color = colors.primary) {
  const Component = iconRegistry[name] || Wrench;
  return <Component size={size} color={color} />;
}

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function Toast({ text }: { text: string }) {
  if (!text) return null;
  return (
    <View style={styles.toastContainer}>
      <CheckCircle2 size={18} color="#FFFFFF" />
      <Text style={styles.toastText}>{text}</Text>
    </View>
  );
}

// ─── HEADER BAR COMPONENT ─────────────────────────────────────────────────────
function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}) {
  return (
    <View style={styles.headerBar}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.headerBackBtn}>
          <ArrowLeft size={22} color={colors.navy} />
        </Pressable>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitleText} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.headerSubtitleText} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{rightAction}</View>
    </View>
  );
}

// ─── BOTTOM NAVIGATION BAR (Home, Bookings, Support, Profile) ──────────────────
function BottomNavigation({
  active,
  onNavigate,
}: {
  active: 'home' | 'bookings' | 'support' | 'profile';
  onNavigate: (screen: Screen) => void;
}) {
  const tabs = [
    { key: 'home', label: 'Home', icon: HomeIcon, screen: 'home' as Screen },
    { key: 'bookings', label: 'Bookings', icon: CalendarDays, screen: 'myBookings' as Screen },
    { key: 'support', label: 'Support', icon: HelpCircle, screen: 'helpSupport' as Screen },
    { key: 'profile', label: 'Profile', icon: UserRound, screen: 'profile' as Screen },
  ];

  return (
    <View style={styles.bottomNavContainer}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const IconComponent = tab.icon;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onNavigate(tab.screen)}
            style={styles.bottomNavItem}
          >
            <View style={[styles.bottomNavIconWrap, isActive && styles.bottomNavIconActive]}>
              <IconComponent
                size={22}
                color={isActive ? colors.primary : '#94A3B8'}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
            </View>
            <Text style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── 1. SPLASH SCREEN (Pixel Perfect + Tagline + Loading Bar) ─────────────────
function SplashScreenView({ onComplete }: { onComplete: () => void }) {
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start(() => {
      onComplete();
    });
  }, [onComplete, progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable onPress={onComplete} style={styles.splashContainer}>
      <StatusBar style="light" />

      {/* Decorative outline background watermarks */}
      <View style={styles.splashWatermarkTopLeft}>
        <Wrench size={120} color="rgba(255,255,255,0.06)" />
      </View>
      <View style={styles.splashWatermarkBottomRight}>
        <HomeIcon size={140} color="rgba(255,255,255,0.06)" />
      </View>
      <View style={styles.splashWatermarkMidRight}>
        <Zap size={90} color="rgba(255,255,255,0.05)" />
      </View>

      {/* Center Branding Block */}
      <View style={styles.splashCenterContent}>
        {/* White Border Logo Box */}
        <View style={styles.splashLogoBox}>
          <View style={styles.splashLogoRowTop}>
            <Text style={styles.splashLogoNow}>NOW</Text>
            <ArrowRight size={24} color="#FFFFFF" strokeWidth={3} style={{ transform: [{ rotate: '-45deg' }] }} />
          </View>
          <View style={styles.splashLogoDivider} />
          <View style={styles.splashLogoRowBottom}>
            <Text style={styles.splashLogoFix}>FIX</Text>
            <View style={styles.splashToolsWrap}>
              <Wrench size={22} color="#F59E0B" strokeWidth={2.5} style={{ transform: [{ rotate: '45deg' }] }} />
              <Hammer size={22} color="#F59E0B" strokeWidth={2.5} style={{ transform: [{ rotate: '-45deg' }], position: 'absolute' }} />
            </View>
          </View>
        </View>

        {/* Tagline: Clear & High Contrast */}
        <Text style={styles.splashTaglineTop}>FIX ANY PROBLEM</Text>
        <Text style={styles.splashTaglineBottom}>INSTANTLY</Text>
      </View>

      {/* Bottom Loading Progress Bar */}
      <View style={styles.splashBottomFooter}>
        <View style={styles.splashProgressBarBg}>
          <Animated.View style={[styles.splashProgressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.splashLoadingText}>Loading...</Text>
      </View>
    </Pressable>
  );
}

// ─── 2. ONBOARDING SCREEN (Mascot + Carousel + Get Started) ───────────────────
function OnboardingScreenView({
  onGetStarted,
  onSkip,
}: {
  onGetStarted: () => void;
  onSkip: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <View style={styles.onboardingHeader}>
        <View style={{ width: 44 }} />
        <Pressable onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skipBtnText}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.onboardingContent} showsVerticalScrollIndicator={false}>
        <View style={styles.onboardingMascotBox}>
          <Image
            source={require('../assets/images/onboard_hero.png')}
            style={styles.onboardingMascotImg}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.onboardingTitle}>
          Home Services{'\n'}Made Simple
        </Text>
        <Text style={styles.onboardingSubtitle}>
          Trusted professionals. Transparent pricing.{'\n'}On-time service.
        </Text>

        <View style={styles.carouselDotsRow}>
          <View style={[styles.carouselDot, styles.carouselDotActive]} />
          <View style={styles.carouselDot} />
          <View style={styles.carouselDot} />
        </View>
      </ScrollView>

      <View style={styles.onboardingFooter}>
        <Pressable onPress={onGetStarted} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Get Started</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 3. LOGIN / SIGN UP SCREEN (Tab Switcher + Social Auth) ───────────────────
function AuthScreenView({
  onAuthenticate,
  onForgotPassword,
}: {
  onAuthenticate: (phone: string) => void;
  onForgotPassword: () => void;
}) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    onAuthenticate(phone);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.authScrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Title */}
        <View style={styles.authHeaderBox}>
          <Text style={styles.authMainTitle}>Welcome to</Text>
          <Text style={styles.authBrandTitle}>NowFix</Text>
          <Text style={styles.authSubtitle}>Login or create an account to continue</Text>
        </View>

        {/* Tab Segment Switcher: [ Login | Sign Up ] */}
        <View style={styles.authTabSwitcher}>
          <Pressable
            onPress={() => { setTab('login'); setError(''); }}
            style={[styles.authTabItem, tab === 'login' && styles.authTabItemActive]}
          >
            <Text style={[styles.authTabText, tab === 'login' && styles.authTabTextActive]}>
              Login
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { setTab('signup'); setError(''); }}
            style={[styles.authTabItem, tab === 'signup' && styles.authTabItemActive]}
          >
            <Text style={[styles.authTabText, tab === 'signup' && styles.authTabTextActive]}>
              Sign Up
            </Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View style={styles.authFormContainer}>
          {tab === 'signup' && (
            <View style={styles.authInputWrap}>
              <UserRound size={18} color="#94A3B8" />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
                style={styles.authTextInput}
              />
            </View>
          )}

          {/* Phone Input with +91 */}
          <View style={styles.authInputWrap}>
            <Text style={styles.authCountryCode}>+91</Text>
            <View style={styles.authInputDivider} />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              style={styles.authTextInput}
            />
          </View>

          {/* Password Input */}
          <View style={styles.authInputWrap}>
            <LockKeyhole size={18} color="#94A3B8" />
            <TextInput
              placeholder={tab === 'login' ? 'Password' : 'Create Password'}
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.authTextInput}
            />
          </View>

          {tab === 'login' && (
            <Pressable onPress={onForgotPassword} style={styles.forgotPassBtn}>
              <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </Pressable>
          )}

          {error ? <Text style={styles.formErrorText}>{error}</Text> : null}

          {/* Action Button */}
          <Pressable onPress={handleSubmit} style={styles.authSubmitBtn}>
            <Text style={styles.authSubmitBtnText}>
              {tab === 'login' ? 'Login' : 'Sign Up'}
            </Text>
          </Pressable>

          {/* Divider: OR */}
          <View style={styles.authOrRow}>
            <View style={styles.authOrLine} />
            <Text style={styles.authOrText}>OR</Text>
            <View style={styles.authOrLine} />
          </View>

          {/* Social Auth Buttons */}
          <Pressable onPress={handleSubmit} style={styles.socialAuthBtn}>
            <Text style={styles.socialGoogleG}>G</Text>
            <Text style={styles.socialAuthBtnText}>Continue with Google</Text>
          </Pressable>

          <Pressable onPress={handleSubmit} style={styles.socialAuthBtn}>
            <Text style={styles.socialAppleLogo}></Text>
            <Text style={styles.socialAuthBtnText}>Continue with Apple</Text>
          </Pressable>

          {/* Footer Toggle Text */}
          <Pressable
            onPress={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
            style={styles.authFooterLink}
          >
            <Text style={styles.authFooterLinkNormal}>
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.authFooterLinkHighlight}>
                {tab === 'login' ? 'Sign Up' : 'Login'}
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. OTP VERIFICATION SCREEN (Clean 4-Digit, Entered Once) ─────────────────
function OtpVerificationView({
  phone,
  onVerify,
  onBack,
}: {
  phone: string;
  onVerify: () => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState(['1', '2', '3', '4']);
  const [timer, setTimer] = useState(28);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (num: string) => {
    const nextIndex = digits.findIndex((d) => !d);
    if (nextIndex !== -1) {
      const copy = [...digits];
      copy[nextIndex] = num;
      setDigits(copy);
    }
  };

  const handleDelete = () => {
    const filledIndices = digits
      .map((d, i) => (d ? i : -1))
      .filter((i) => i !== -1);
    if (filledIndices.length > 0) {
      const lastIndex = filledIndices[filledIndices.length - 1];
      const copy = [...digits];
      copy[lastIndex] = '';
      setDigits(copy);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="" onBack={onBack} />

      <View style={styles.otpHeaderBox}>
        <Text style={styles.otpMainTitle}>Verify Your Number</Text>
        <Text style={styles.otpSubtitle}>
          We have sent a 4-digit code to{'\n'}
          <Text style={{ fontFamily: typography.semibold, color: colors.navy }}>
            +91 {phone || '98765 43210'}
          </Text>
        </Text>
      </View>

      {/* 4-digit boxes */}
      <View style={styles.otpBoxesRow}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.otpDigitBox,
              digits[index] ? styles.otpDigitBoxFilled : null,
            ]}
          >
            <Text style={styles.otpDigitText}>{digits[index] || ''}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.otpResendTimer}>
        {timer > 0 ? `Resend OTP in 00:${timer < 10 ? `0${timer}` : timer}` : 'Resend OTP'}
      </Text>

      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <Pressable onPress={onVerify} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Verify</Text>
        </Pressable>
      </View>

      {/* Clean In-App Keypad */}
      <View style={styles.keypadContainer}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', '⌫'],
        ].map((row, ri) => (
          <View key={ri} style={styles.keypadRow}>
            {row.map((key, ki) => (
              <Pressable
                key={ki}
                onPress={() => {
                  if (key === '⌫') handleDelete();
                  else if (key) handleKeyPress(key);
                }}
                style={styles.keypadBtn}
              >
                <Text style={styles.keypadKeyText}>{key}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── 5. LOCATION SELECTOR SCREEN (Map + Current Location) ─────────────────────
function LocationSelectorView({
  selectedLocation,
  onSelect,
  onConfirm,
  onBack,
}: {
  selectedLocation: string;
  onSelect: (loc: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = popularCities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Select Your Location" subtitle="We'll show services available near you" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.locationScrollContent} keyboardShouldPersistTaps="handled">
        {/* Search location */}
        <View style={styles.locationSearchWrap}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search location..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={styles.locationSearchInput}
          />
        </View>

        {/* Map Preview Box */}
        <View style={styles.locationMapCard}>
          <View style={styles.locationMapBg}>
            {/* Grid styling to represent map tiles */}
            <View style={styles.mapGridLine1} />
            <View style={styles.mapGridLine2} />
            <View style={styles.mapGridLine3} />
            {/* Location Pin */}
            <View style={styles.mapPinCallout}>
              <View style={styles.mapPinBubble}>
                <MapPin size={14} color={colors.primary} />
                <Text style={styles.mapPinText}>{selectedLocation}</Text>
              </View>
              <View style={styles.mapPinIconCircle}>
                <MapPin size={22} color="#EF4444" fill="#EF4444" />
              </View>
            </View>
          </View>
        </View>

        {/* Use Current Location button */}
        <Pressable
          onPress={() => onSelect('Bikaner, Rajasthan')}
          style={styles.useCurrentLocBtn}
        >
          <Target size={20} color={colors.primary} />
          <Text style={styles.useCurrentLocText}>Use Current Location</Text>
        </Pressable>

        {/* Recent / Popular locations */}
        <Text style={styles.sectionHeadingText}>Recent & Popular Cities</Text>
        <View style={styles.citiesChipWrap}>
          {filtered.map((city) => {
            const full = `${city}, Rajasthan`;
            const isSel = selectedLocation.startsWith(city);
            return (
              <Pressable
                key={city}
                onPress={() => onSelect(full)}
                style={[styles.cityChip, isSel && styles.cityChipSelected]}
              >
                <Text style={[styles.cityChipText, isSel && styles.cityChipTextSelected]}>
                  {city}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.locationFooter}>
        <Pressable onPress={onConfirm} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Confirm Location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 6. HOME DASHBOARD SCREEN ─────────────────────────────────────────────────
function HomeDashboardView({
  location,
  onOpenLocation,
  onOpenCategories,
  onSelectCategory,
  onSearch,
  onBookNow,
  onTabChange,
}: {
  location: string;
  onOpenLocation: () => void;
  onOpenCategories: () => void;
  onSelectCategory: (catId: string) => void;
  onSearch: () => void;
  onBookNow: () => void;
  onTabChange: (screen: Screen) => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.homeScrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.homeTopBar}>
          <Pressable onPress={onOpenLocation} style={styles.homeLocationPill}>
            <MapPin size={14} color={colors.primary} />
            <Text style={styles.homeLocationText} numberOfLines={1}>
              {location}
            </Text>
            <ChevronDown size={14} color={colors.primary} />
          </Pressable>
          <Pressable style={styles.homeBellBtn}>
            <Bell size={20} color={colors.navy} />
            <View style={styles.homeBellBadge} />
          </Pressable>
        </View>

        {/* User Greeting */}
        <View style={styles.homeGreetingBox}>
          <Text style={styles.homeGreetingText}>
            Good Morning, <Text style={{ fontFamily: typography.bold }}>Mayank 👋</Text>
          </Text>
        </View>

        {/* Search Bar */}
        <Pressable onPress={onSearch} style={styles.homeSearchCard}>
          <Search size={18} color="#94A3B8" />
          <Text style={styles.homeSearchPlaceholder}>Search for a service...</Text>
        </Pressable>

        {/* Promotional Hero Banner */}
        <View style={styles.homePromoCard}>
          <View style={styles.homePromoTextWrap}>
            <Text style={styles.homePromoTitle}>Home Repairs{'\n'}Made Easy</Text>
            <Text style={styles.homePromoSub}>Trusted professionals{'\n'}at your doorstep</Text>
            <Pressable onPress={onBookNow} style={styles.homePromoBookBtn}>
              <Text style={styles.homePromoBookText}>Book Now</Text>
            </Pressable>
          </View>
          <View style={styles.homePromoMascotWrap}>
            <Image
              source={require('../assets/images/onboard_hero.png')}
              style={styles.homePromoMascotImg}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Popular Services Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <Pressable onPress={onOpenCategories}>
            <Text style={styles.sectionSeeAll}>See All</Text>
          </Pressable>
        </View>

        {/* 6 Grid Service Items */}
        <View style={styles.homeServicesGrid}>
          {categories.slice(0, 6).map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              style={styles.homeServiceItemCard}
            >
              <View style={[styles.homeServiceIconBox, { backgroundColor: cat.bg }]}>
                {renderDynamicIcon(cat.icon, 26, cat.color)}
              </View>
              <Text style={styles.homeServiceName}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>

        {/* Trust Badges Bar */}
        <View style={styles.homeTrustStrip}>
          <View style={styles.homeTrustItem}>
            <ShieldCheck size={20} color={colors.primary} />
            <Text style={styles.homeTrustText}>Verified Experts</Text>
          </View>
          <View style={styles.homeTrustDivider} />
          <View style={styles.homeTrustItem}>
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.homeTrustText}>4.8+ Rated</Text>
          </View>
          <View style={styles.homeTrustDivider} />
          <View style={styles.homeTrustItem}>
            <Clock3 size={20} color="#10B981" />
            <Text style={styles.homeTrustText}>On-Time Service</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation active="home" onNavigate={onTabChange} />
    </SafeAreaView>
  );
}

// ─── 7. SERVICE CATEGORIES (ALL SERVICES) ─────────────────────────────────────
function AllServicesView({
  onSelectCategory,
  onBack,
  onTabChange,
}: {
  onSelectCategory: (id: string) => void;
  onBack: () => void;
  onTabChange: (screen: Screen) => void;
}) {
  const [filter, setFilter] = useState<'All' | 'Repair' | 'Cleaning' | 'Installation'>('All');

  const filteredCategories = categories.filter((cat) => {
    if (filter === 'All') return true;
    return cat.category === filter;
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="All Services" onBack={onBack} />

      {/* Filter Chips Row */}
      <View style={styles.categoriesFilterRow}>
        {(['All', 'Repair', 'Cleaning', 'Installation'] as const).map((tag) => (
          <Pressable
            key={tag}
            onPress={() => setFilter(tag)}
            style={[styles.categoryFilterChip, filter === tag && styles.categoryFilterChipActive]}
          >
            <Text style={[styles.categoryFilterChipText, filter === tag && styles.categoryFilterChipTextActive]}>
              {tag}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.allServicesList} showsVerticalScrollIndicator={false}>
        {filteredCategories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => onSelectCategory(cat.id)}
            style={styles.allServiceCard}
          >
            <View style={[styles.allServiceIconBox, { backgroundColor: cat.bg }]}>
              {renderDynamicIcon(cat.icon, 24, cat.color)}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.allServiceTitle}>{cat.name}</Text>
              <Text style={styles.allServiceSub}>{cat.sub}</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>
        ))}
      </ScrollView>

      <BottomNavigation active="home" onNavigate={onTabChange} />
    </SafeAreaView>
  );
}

// ─── 8. SERVICE DETAILS SCREEN ────────────────────────────────────────────────
function ServiceDetailsView({
  onBookNow,
  onBack,
}: {
  onBookNow: () => void;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Electrician" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.serviceDetailsScroll} showsVerticalScrollIndicator={false}>
        {/* Hero Photo / Graphic Box */}
        <View style={styles.serviceDetailsBanner}>
          <View style={styles.serviceDetailsBannerOverlay}>
            <Zap size={56} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.serviceDetailsBannerTag}>Certified Electrical Experts</Text>
          </View>
        </View>

        {/* Title & Rating */}
        <View style={styles.serviceDetailsHeaderCard}>
          <Text style={styles.serviceDetailsTitle}>Electrician</Text>
          <View style={styles.serviceDetailsRatingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.serviceDetailsRatingText}>4.8 (1.2k reviews)</Text>
          </View>
        </View>

        {/* 3 Trust Feature Badges Row */}
        <View style={styles.serviceDetailsTrustRow}>
          <View style={styles.serviceDetailsTrustCard}>
            <ShieldCheck size={22} color={colors.primary} />
            <Text style={styles.serviceDetailsTrustText}>Verified{'\n'}Professionals</Text>
          </View>
          <View style={styles.serviceDetailsTrustCard}>
            <FileText size={22} color="#10B981" />
            <Text style={styles.serviceDetailsTrustText}>Transparent{'\n'}Pricing</Text>
          </View>
          <View style={styles.serviceDetailsTrustCard}>
            <Clock3 size={22} color="#F59E0B" />
            <Text style={styles.serviceDetailsTrustText}>On-Time{'\n'}Service</Text>
          </View>
        </View>

        {/* About This Service */}
        <View style={styles.serviceDetailsAboutCard}>
          <Text style={styles.serviceDetailsSectionTitle}>About This Service</Text>
          <Text style={styles.serviceDetailsAboutBody}>
            Get reliable electrical services from background-checked professionals.
            We handle electrical wiring, switches, sockets, fan installations,
            repairs, and general maintenance for your home or office.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky Booking Bar */}
      <View style={styles.serviceDetailsFooterBar}>
        <View>
          <Text style={styles.serviceDetailsPriceLabel}>Starting Price</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={styles.serviceDetailsPriceValue}>₹299</Text>
            <Text style={styles.serviceDetailsPriceDetails}>View Details &gt;</Text>
          </View>
        </View>
        <Pressable onPress={onBookNow} style={styles.serviceDetailsBookBtn}>
          <Text style={styles.serviceDetailsBookBtnText}>Book Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 9. SEARCH & RESULTS SCREEN ───────────────────────────────────────────────
function SearchResultsView({
  onSelectService,
  onBack,
}: {
  onSelectService: () => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState('AC repair');
  const [tab, setTab] = useState<'All' | 'Services' | 'Professionals'>('All');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <View style={styles.searchTopRow}>
        <Pressable onPress={onBack} style={styles.headerBackBtn}>
          <ArrowLeft size={22} color={colors.navy} />
        </Pressable>
        <View style={styles.searchBarInputWrap}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a service..."
            placeholderTextColor="#94A3B8"
            style={styles.searchBarRealInput}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <X size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Tabs: [ All | Services | Professionals ] */}
      <View style={styles.searchFilterChipsRow}>
        {(['All', 'Services', 'Professionals'] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.categoryFilterChip, tab === t && styles.categoryFilterChipActive]}
          >
            <Text style={[styles.categoryFilterChipText, tab === t && styles.categoryFilterChipTextActive]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.searchResultsList}>
        <Text style={styles.searchResultsCount}>Results ({searchResults.length})</Text>
        {searchResults.map((res) => (
          <Pressable key={res.id} onPress={onSelectService} style={styles.searchResultCard}>
            <View style={styles.searchResultIconBox}>
              <Snowflake size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.searchResultTitle}>{res.title}</Text>
              <Text style={styles.searchResultSub}>{res.sub}</Text>
              <View style={styles.searchResultMetaRow}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.searchResultRating}>{res.rating} ({res.reviews})</Text>
                <Text style={styles.searchResultPrice}>From ₹{res.price}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── BOOKING FLOW PROGRESS STEPPER BAR (1 to 5) ───────────────────────────────
function BookingStepperBar({ activeStep }: { activeStep: number }) {
  const steps = ['Service', 'Media', 'Address', 'Schedule', 'Confirm'];
  return (
    <View style={styles.stepperWrap}>
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isDone = stepNum < activeStep;
        const isCurrent = stepNum === activeStep;
        return (
          <React.Fragment key={label}>
            <View style={styles.stepperItem}>
              <View
                style={[
                  styles.stepperCircle,
                  isDone && styles.stepperCircleDone,
                  isCurrent && styles.stepperCircleActive,
                ]}
              >
                {isDone ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text style={[styles.stepperNumber, isCurrent && styles.stepperNumberActive]}>
                    {stepNum}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepperLabel, isCurrent && styles.stepperLabelActive]}>
                {label}
              </Text>
            </View>
            {idx < steps.length - 1 && (
              <View style={[styles.stepperLine, isDone && styles.stepperLineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── 10. BOOKING STEP 1: SELECT SERVICE + REQUIREMENTS ────────────────────────
function BookRequirementsView({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'General' | 'Installation' | 'Repair'>('General');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Book Service" onBack={onBack} />
      <BookingStepperBar activeStep={1} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent} keyboardShouldPersistTaps="handled">
        {/* Selected Service Card */}
        <Text style={styles.bookingSectionLabel}>Selected Service</Text>
        <View style={styles.bookingServiceCard}>
          <View style={[styles.bookingServiceIconBox, { backgroundColor: '#FEF3C7' }]}>
            <Zap size={24} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookingServiceName}>Electrician</Text>
            <Text style={styles.bookingServicePrice}>Starting from ₹299</Text>
          </View>
        </View>

        {/* Problem Description */}
        <Text style={styles.bookingSectionLabel}>Describe Your Problem</Text>
        <View style={styles.bookingTextAreaWrap}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="E.g. Fan not working, switch issue..."
            placeholderTextColor="#94A3B8"
            value={desc}
            onChangeText={setDesc}
            maxLength={300}
            style={styles.bookingTextArea}
          />
          <Text style={styles.charCountText}>{desc.length}/300</Text>
        </View>

        {/* Preferred Service Type */}
        <Text style={styles.bookingSectionLabel}>Preferred Service Type</Text>
        <View style={styles.serviceTypeChipsRow}>
          {(['General', 'Installation', 'Repair'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.serviceTypeChip, type === t && styles.serviceTypeChipActive]}
            >
              <Text style={[styles.serviceTypeChipText, type === t && styles.serviceTypeChipTextActive]}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onNext} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Next</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 11. BOOKING STEP 2: UPLOAD PHOTO / VIDEO ─────────────────────────────────
function BookMediaView({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [photoCount, setPhotoCount] = useState(2);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Upload Photos / Videos" onBack={onBack} />
      <BookingStepperBar activeStep={2} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        {/* Upload Dropzone */}
        <Pressable onPress={() => setPhotoCount((c) => c + 1)} style={styles.mediaUploadDropzone}>
          <View style={styles.mediaUploadIconCircle}>
            <Camera size={26} color={colors.primary} />
          </View>
          <Text style={styles.mediaUploadTitle}>Upload Photos / Videos</Text>
          <Text style={styles.mediaUploadSub}>Add images or short video of the issue</Text>
          <Text style={styles.mediaUploadFormats}>Supports: JPG, PNG, MP4 (Max 50MB)</Text>
        </Pressable>

        {/* Thumbnails Row */}
        <Text style={styles.bookingSectionLabel}>Attached Files ({photoCount})</Text>
        <View style={styles.mediaThumbnailsRow}>
          {Array.from({ length: photoCount }).map((_, i) => (
            <View key={i} style={styles.mediaThumbnailBox}>
              <Wrench size={24} color={colors.primary} />
              <Text style={styles.mediaThumbText}>Photo {i + 1}</Text>
              <Pressable
                onPress={() => setPhotoCount((c) => Math.max(1, c - 1))}
                style={styles.mediaThumbRemoveBtn}
              >
                <X size={12} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}
        </View>

        <Pressable onPress={() => setPhotoCount((c) => c + 1)} style={styles.addMoreBtn}>
          <Plus size={16} color={colors.primary} />
          <Text style={styles.addMoreBtnText}>+ Add More</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onNext} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Next</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 12. BOOKING STEP 3: ADDRESS + MAP LOCATION ───────────────────────────────
function BookAddressView({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedAddr, setSelectedAddr] = useState('Home');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Service Address" onBack={onBack} />
      <BookingStepperBar activeStep={3} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        <Text style={styles.bookingSectionLabel}>Select Address</Text>
        {[
          { type: 'Home', address: '123, Gandhi Nagar, Bikaner' },
          { type: 'Office', address: '456, Station Road, Bikaner' },
        ].map((item) => {
          const isSelected = selectedAddr === item.type;
          return (
            <Pressable
              key={item.type}
              onPress={() => setSelectedAddr(item.type)}
              style={[styles.addressRadioCard, isSelected && styles.addressRadioCardActive]}
            >
              <View style={[styles.addressRadioCircle, isSelected && styles.addressRadioCircleActive]}>
                {isSelected && <View style={styles.addressRadioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.addressTypeTitle}>{item.type}</Text>
                <Text style={styles.addressTextBody}>{item.address}</Text>
              </View>
              <Text style={styles.addressEditLink}>Edit</Text>
            </Pressable>
          );
        })}

        <Pressable style={styles.addAddressOutlineBtn}>
          <Plus size={16} color={colors.primary} />
          <Text style={styles.addAddressOutlineText}>+ Add New Address</Text>
        </Pressable>

        {/* Or Select on Map Preview */}
        <Text style={styles.bookingSectionLabel}>Or Select on Map</Text>
        <View style={styles.mapPreviewCard}>
          <View style={styles.mapPreviewBg}>
            <MapPin size={28} color="#EF4444" fill="#EF4444" />
          </View>
          <Pressable style={styles.useThisLocBtn}>
            <Text style={styles.useThisLocText}>Use This Location</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onNext} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Next</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 13. BOOKING STEP 4: DATE & TIME + EMERGENCY ──────────────────────────────
function BookScheduleView({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState('Tomorrow 17 Sep');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM - 1:00 PM');
  const [emergency, setEmergency] = useState(false);

  const dates = [
    { label: 'Today\n16 Sep', id: 'Today 16 Sep' },
    { label: 'Tomorrow\n17 Sep', id: 'Tomorrow 17 Sep' },
    { label: 'Thu\n18 Sep', id: 'Thu 18 Sep' },
    { label: 'Fri\n19 Sep', id: 'Fri 19 Sep' },
  ];

  const slots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Date & Time" onBack={onBack} />
      <BookingStepperBar activeStep={4} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        {/* Date Selection */}
        <Text style={styles.bookingSectionLabel}>Select Date</Text>
        <View style={styles.scheduleDatesRow}>
          {dates.map((d) => {
            const isSel = selectedDate === d.id;
            return (
              <Pressable
                key={d.id}
                onPress={() => setSelectedDate(d.id)}
                style={[styles.scheduleDatePill, isSel && styles.scheduleDatePillActive]}
              >
                <Text style={[styles.scheduleDateText, isSel && styles.scheduleDateTextActive]}>
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Time Slots */}
        <Text style={styles.bookingSectionLabel}>Select Time Slot</Text>
        {slots.map((slot) => {
          const isSel = selectedSlot === slot;
          return (
            <Pressable
              key={slot}
              onPress={() => setSelectedSlot(slot)}
              style={[styles.slotRadioCard, isSel && styles.slotRadioCardActive]}
            >
              <View style={[styles.addressRadioCircle, isSel && styles.addressRadioCircleActive]}>
                {isSel && <View style={styles.addressRadioDot} />}
              </View>
              <Text style={[styles.slotText, isSel && styles.slotTextActive]}>{slot}</Text>
            </Pressable>
          );
        })}

        {/* Emergency Booking Card */}
        <View style={styles.emergencyBookingCard}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Zap size={18} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.emergencyTitle}>Emergency Booking</Text>
            </View>
            <Text style={styles.emergencySub}>Get priority service (Extra charges may apply)</Text>
          </View>
          <Switch
            value={emergency}
            onValueChange={setEmergency}
            trackColor={{ false: '#CBD5E1', true: colors.primary }}
          />
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onNext} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Next</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 14. BOOKING STEP 5: PRICE + SUMMARY + CONFIRM ────────────────────────────
function BookConfirmView({
  onConfirm,
  onBack,
}: {
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Price & Confirm" onBack={onBack} />
      <BookingStepperBar activeStep={5} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        {/* Price Breakdown */}
        <Text style={styles.bookingSectionLabel}>Price Breakdown</Text>
        <View style={styles.priceBreakdownCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Charges</Text>
            <Text style={styles.priceVal}>₹299</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Visit Fee</Text>
            <Text style={[styles.priceVal, { color: '#10B981' }]}>₹0 (FREE)</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Emergency Charges</Text>
            <Text style={styles.priceVal}>₹0</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST (18%)</Text>
            <Text style={styles.priceVal}>₹54</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalVal}>₹353</Text>
          </View>
        </View>

        {/* Apply Coupon */}
        <Pressable style={styles.applyCouponRow}>
          <Sparkles size={18} color="#F59E0B" />
          <Text style={styles.applyCouponText}>Apply Coupon</Text>
          <ChevronRight size={18} color="#94A3B8" />
        </Pressable>

        {/* Booking Summary */}
        <Text style={styles.bookingSectionLabel}>Booking Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryItemLabel}>Service</Text>
            <Text style={styles.summaryItemValue}>Electrician</Text>
          </View>
          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryItemLabel}>Date & Time</Text>
            <Text style={styles.summaryItemValue}>17 Sep 2024, 11:00 AM</Text>
          </View>
          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryItemLabel}>Address</Text>
            <Text style={styles.summaryItemValue}>Home</Text>
          </View>
          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryItemLabel}>Payment</Text>
            <Text style={styles.summaryItemValue}>Online Payment</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onConfirm} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Confirm Booking</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 15. PROVIDER SELECTION + STATUS (Radar Pulse Matching) ───────────────────
function ProviderStatusView({ onMatched }: { onMatched: () => void }) {
  useEffect(() => {
    const t = setTimeout(onMatched, 2800);
    return () => clearTimeout(t);
  }, [onMatched]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <View style={styles.providerMatchingContent}>
        <Text style={styles.providerMatchingTitle}>Finding the Best Professional</Text>
        <Text style={styles.providerMatchingSub}>
          We're matching you with verified professionals near you.
        </Text>

        {/* Radar Pulse Graphics */}
        <Pressable onPress={onMatched} style={styles.radarPulseContainer}>
          <View style={styles.radarOuterCircle}>
            <View style={styles.radarMidCircle}>
              <View style={styles.radarCenterCircle}>
                <Search size={36} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          </View>
        </Pressable>

        {/* Live Matching Checklist */}
        <View style={styles.matchingChecklistCard}>
          <View style={styles.matchingStepRow}>
            <CheckCircle2 size={18} color="#10B981" />
            <Text style={styles.matchingStepDoneText}>Searching nearby professionals</Text>
          </View>
          <View style={styles.matchingStepRow}>
            <View style={styles.matchingStepCurrentDot} />
            <Text style={styles.matchingStepCurrentText}>Checking availability</Text>
          </View>
          <View style={styles.matchingStepRow}>
            <View style={styles.matchingStepIdleDot} />
            <Text style={styles.matchingStepIdleText}>Confirming provider</Text>
          </View>
          <View style={styles.matchingStepRow}>
            <View style={styles.matchingStepIdleDot} />
            <Text style={styles.matchingStepIdleText}>Almost done</Text>
          </View>
        </View>

        <Text style={styles.matchingTimeNote}>ℹ This usually takes less than 1 minute.</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── 16. LIVE TRACKING + PAYMENT ──────────────────────────────────────────────
function LiveTrackingView({
  onPayNow,
  onBack,
}: {
  onPayNow: () => void;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Live Tracking & Payment" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.liveTrackingScroll}>
        {/* Provider Card */}
        <View style={styles.trackingProviderCard}>
          <View style={styles.trackingProviderAvatarBox}>
            <UserRound size={26} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.trackingProviderName}>Rohit Sharma</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.trackingProviderRating}>4.8 (120 reviews)</Text>
            </View>
          </View>
          <View style={styles.trackingActionBtnsRow}>
            <Pressable style={styles.trackingRoundActionBtn}>
              <Phone size={18} color={colors.primary} />
            </Pressable>
            <Pressable style={styles.trackingRoundActionBtn}>
              <MessageCircle size={18} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* ETA Banner */}
        <View style={styles.trackingEtaCard}>
          <View style={styles.trackingEtaDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.trackingEtaTitle}>On the way</Text>
            <Text style={styles.trackingEtaSub}>Arriving in 5 mins</Text>
          </View>
        </View>

        {/* Route Map Graphic */}
        <View style={styles.trackingMapBox}>
          <View style={styles.trackingMapLine} />
          <View style={styles.trackingProviderPin}>
            <UserRound size={16} color="#FFFFFF" />
          </View>
          <View style={styles.trackingHomePin}>
            <HomeIcon size={16} color="#FFFFFF" />
          </View>
        </View>
      </ScrollView>

      {/* Payment Action Bar */}
      <View style={styles.trackingPaymentBar}>
        <View>
          <Text style={styles.trackingPaymentLabel}>Payment</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={styles.trackingPaymentAmount}>₹353</Text>
            <Text style={styles.trackingPaymentMethod}>Online Payment Change &gt;</Text>
          </View>
        </View>
        <Pressable onPress={onPayNow} style={styles.trackingPayNowBtn}>
          <Text style={styles.trackingPayNowBtnText}>Pay Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 17. BOOKING COMPLETED + SUCCESS ──────────────────────────────────────────
function BookingSuccessView({
  onViewBooking,
  onGoHome,
}: {
  onViewBooking: () => void;
  onGoHome: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <View style={styles.successMainContainer}>
        {/* Big Green Checkmark */}
        <View style={styles.successCircle}>
          <Check size={52} color="#FFFFFF" strokeWidth={3} />
        </View>

        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>Your service has been successfully booked.</Text>

        {/* Receipt Card */}
        <View style={styles.successReceiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Booking ID</Text>
            <Text style={styles.receiptValueBold}>#NF12345</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Service</Text>
            <Text style={styles.receiptValue}>Electrician</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Date & Time</Text>
            <Text style={styles.receiptValue}>17 Sep 2024, 11:00 AM</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Provider</Text>
            <Text style={styles.receiptValue}>Rohit Sharma</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Address</Text>
            <Text style={styles.receiptValue}>Home</Text>
          </View>
          <View style={styles.receiptDivider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptTotalLabel}>Amount</Text>
            <Text style={styles.receiptTotalValue}>₹353</Text>
          </View>
        </View>

        {/* Buttons */}
        <Pressable onPress={onViewBooking} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>View Booking</Text>
        </Pressable>

        <Pressable onPress={onGoHome} style={styles.secondaryOutlineBtn}>
          <Text style={styles.secondaryOutlineBtnText}>Go to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 18. MY BOOKINGS (Upcoming, Completed, Cancelled) ─────────────────────────
function MyBookingsView({
  onViewDetails,
  onReschedule,
  onCancel,
  onRate,
  onTabChange,
}: {
  onViewDetails: (bookingId: string) => void;
  onReschedule: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  onRate: (bookingId: string) => void;
  onTabChange: (screen: Screen) => void;
}) {
  const [tab, setTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

  const filtered = initialBookings.filter((b) => b.status === tab);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <View style={styles.headerBarNoBack}>
        <Text style={styles.headerTitleText}>My Bookings</Text>
      </View>

      {/* Tabs: [ Upcoming (2) | Completed (3) | Cancelled (1) ] */}
      <View style={styles.bookingsFilterRow}>
        {(['Upcoming', 'Completed', 'Cancelled'] as const).map((t) => {
          const count = initialBookings.filter((b) => b.status === t).length;
          const isActive = tab === t;
          return (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.bookingTabChip, isActive && styles.bookingTabChipActive]}
            >
              <Text style={[styles.bookingTabChipText, isActive && styles.bookingTabChipTextActive]}>
                {t} ({count})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.bookingsListContent} showsVerticalScrollIndicator={false}>
        {filtered.map((b) => (
          <View key={b.id} style={styles.bookingItemCard}>
            {/* Header: Service + Tag */}
            <View style={styles.bookingItemHeaderRow}>
              <View style={styles.bookingItemServiceInfo}>
                <Wrench size={18} color={colors.primary} />
                <Text style={styles.bookingItemTitle}>{b.service}</Text>
              </View>
              <View
                style={[
                  styles.bookingStatusTag,
                  b.status === 'Completed'
                    ? styles.statusTagCompleted
                    : b.status === 'Cancelled'
                    ? styles.statusTagCancelled
                    : styles.statusTagUpcoming,
                ]}
              >
                <Text
                  style={[
                    styles.bookingStatusTagText,
                    b.status === 'Completed'
                      ? styles.statusTextCompleted
                      : b.status === 'Cancelled'
                      ? styles.statusTextCancelled
                      : styles.statusTextUpcoming,
                  ]}
                >
                  {b.status}
                </Text>
              </View>
            </View>

            <Text style={styles.bookingItemSub}>{b.sub}</Text>
            <View style={styles.bookingItemMetaRow}>
              <CalendarDays size={14} color="#64748B" />
              <Text style={styles.bookingItemMetaText}>{b.date}</Text>
            </View>
            <View style={styles.bookingItemMetaRow}>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.bookingItemMetaText}>{b.address}</Text>
            </View>

            {/* Provider and Price */}
            <View style={styles.bookingItemProviderRow}>
              <View style={styles.bookingProviderAvatarSmall}>
                <UserRound size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookingProviderNameSmall}>{b.providerName}</Text>
                <Text style={styles.bookingProviderRatingSmall}>★ {b.providerRating}</Text>
              </View>
              <Text style={styles.bookingPriceTag}>₹{b.price}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.bookingItemActionsRow}>
              <Pressable
                onPress={() => onViewDetails(b.id)}
                style={styles.bookingActionOutlineBtn}
              >
                <Text style={styles.bookingActionOutlineText}>View Details</Text>
              </Pressable>

              {b.status === 'Upcoming' && (
                <Pressable
                  onPress={() => onReschedule(b.id)}
                  style={styles.bookingActionPrimaryBtn}
                >
                  <Text style={styles.bookingActionPrimaryText}>Reschedule</Text>
                </Pressable>
              )}

              {b.status === 'Completed' && (
                <Pressable
                  onPress={() => onRate(b.id)}
                  style={styles.bookingActionPrimaryBtn}
                >
                  <Text style={styles.bookingActionPrimaryText}>Rate Service</Text>
                </Pressable>
              )}

              {b.status === 'Cancelled' && (
                <Pressable
                  onPress={() => onViewDetails(b.id)}
                  style={styles.bookingActionOutlineBtn}
                >
                  <Text style={styles.bookingActionOutlineText}>Refund Info</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation active="bookings" onNavigate={onTabChange} />
    </SafeAreaView>
  );
}

// ─── 19. BOOKING DETAILS SCREEN ───────────────────────────────────────────────
function BookingDetailsView({
  onReschedule,
  onCancel,
  onBack,
}: {
  onReschedule: () => void;
  onCancel: () => void;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader
        title="Booking Details"
        subtitle="Booking ID #NF12345"
        onBack={onBack}
        rightAction={
          <View style={styles.statusTagUpcoming}>
            <Text style={styles.statusTextUpcoming}>Upcoming</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.bookingDetailsScroll}>
        {/* Service Card */}
        <View style={styles.detailsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={[styles.bookingServiceIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Zap size={22} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailsServiceName}>Electrician</Text>
              <Text style={styles.detailsServiceSub}>Wiring, switches, fan installation</Text>
              <Text style={styles.detailsServiceDate}>17 Sep 2024, 11:00 AM - 1:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.detailsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.trackingProviderAvatarBox}>
              <UserRound size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trackingProviderName}>Rohit Sharma</Text>
              <Text style={styles.trackingProviderRating}>★ 4.8 (120 reviews)</Text>
            </View>
            <Pressable style={styles.detailsCallBtn}>
              <Phone size={18} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Address */}
        <View style={styles.detailsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <MapPin size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailsAddressTitle}>Home</Text>
              <Text style={styles.detailsAddressSub}>123, Gandhi Nagar, Bikaner</Text>
            </View>
          </View>
        </View>

        {/* Problem Description */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Problem Description</Text>
          <Text style={styles.detailsBodyText}>
            Fan not working properly and need to install 2 new switches.
          </Text>
        </View>

        {/* Booking Timeline */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Booking Timeline</Text>
          <View style={styles.timelineList}>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDotDone} />
              <View style={{ flex: 1 }}>
                <Text style={styles.timelineTitleDone}>Booking Confirmed</Text>
                <Text style={styles.timelineTimeSub}>16 Sep 2024, 10:00 AM</Text>
              </View>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDotPending} />
              <Text style={styles.timelineTitlePending}>Provider En Route</Text>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDotPending} />
              <Text style={styles.timelineTitlePending}>Service In Progress</Text>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDotPending} />
              <Text style={styles.timelineTitlePending}>Completed</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.detailsActionBottomBar}>
        <Pressable onPress={onReschedule} style={styles.detailsRescheduleBtn}>
          <Text style={styles.detailsRescheduleBtnText}>Reschedule</Text>
        </Pressable>
        <Pressable onPress={onCancel} style={styles.detailsCancelBtn}>
          <Text style={styles.detailsCancelBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 20. RESCHEDULE BOOKING SCREEN ────────────────────────────────────────────
function RescheduleBookingView({
  onConfirmReschedule,
  onBack,
}: {
  onConfirmReschedule: () => void;
  onBack: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState('17 Sep');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM - 1:00 PM');

  const dates = ['16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep'];
  const slots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Reschedule Booking" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        {/* Service Preview */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsServiceName}>Electrician</Text>
          <Text style={styles.detailsServiceSub}>Booking ID: #NF12345</Text>
          <Text style={styles.detailsServiceDate}>Current: 17 Sep 2024, 11:00 AM - 1:00 PM</Text>
        </View>

        {/* Select New Date */}
        <Text style={styles.bookingSectionLabel}>Select New Date</Text>
        <View style={styles.scheduleDatesRow}>
          {dates.map((d) => {
            const isSel = selectedDate === d;
            return (
              <Pressable
                key={d}
                onPress={() => setSelectedDate(d)}
                style={[styles.rescheduleDatePill, isSel && styles.rescheduleDatePillActive]}
              >
                <Text style={[styles.rescheduleDateText, isSel && styles.rescheduleDateTextActive]}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Select Time Slot */}
        <Text style={styles.bookingSectionLabel}>Select Time Slot</Text>
        {slots.map((s) => {
          const isSel = selectedSlot === s;
          return (
            <Pressable
              key={s}
              onPress={() => setSelectedSlot(s)}
              style={[styles.slotRadioCard, isSel && styles.slotRadioCardActive]}
            >
              <View style={[styles.addressRadioCircle, isSel && styles.addressRadioCircleActive]}>
                {isSel && <View style={styles.addressRadioDot} />}
              </View>
              <Text style={[styles.slotText, isSel && styles.slotTextActive]}>{s}</Text>
            </Pressable>
          );
        })}

        {/* Emergency Reschedule Banner */}
        <View style={styles.emergencyBanner}>
          <Zap size={18} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.emergencyBannerText}>
            Emergency Reschedule: Additional charges may apply for same day reschedule.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onConfirmReschedule} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Confirm Reschedule</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 21. CANCEL BOOKING SCREEN ────────────────────────────────────────────────
function CancelBookingView({
  onConfirmCancel,
  onBack,
}: {
  onConfirmCancel: () => void;
  onBack: () => void;
}) {
  const [reason, setReason] = useState('Changed my plans');
  const [details, setDetails] = useState('');

  const reasons = [
    'Changed my plans',
    'Issue resolved',
    'Found another provider',
    'Not needed anymore',
    'Other reason',
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Cancel Booking" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        {/* Service Preview */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsServiceName}>Electrician</Text>
          <Text style={styles.detailsServiceSub}>Booking ID: #NF12345</Text>
          <Text style={styles.detailsServiceDate}>17 Sep 2024, 11:00 AM - 1:00 PM</Text>
        </View>

        {/* Select Reason */}
        <Text style={styles.bookingSectionLabel}>Select Reason</Text>
        {reasons.map((r) => {
          const isSel = reason === r;
          return (
            <Pressable
              key={r}
              onPress={() => setReason(r)}
              style={[styles.slotRadioCard, isSel && styles.slotRadioCardActive]}
            >
              <View style={[styles.addressRadioCircle, isSel && styles.addressRadioCircleActive]}>
                {isSel && <View style={styles.addressRadioDot} />}
              </View>
              <Text style={[styles.slotText, isSel && styles.slotTextActive]}>{r}</Text>
            </Pressable>
          );
        })}

        {/* Additional Details */}
        <Text style={styles.bookingSectionLabel}>Additional Details (Optional)</Text>
        <View style={styles.bookingTextAreaWrap}>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Please share more details..."
            placeholderTextColor="#94A3B8"
            value={details}
            onChangeText={setDetails}
            maxLength={200}
            style={styles.bookingTextArea}
          />
          <Text style={styles.charCountText}>{details.length}/200</Text>
        </View>

        {/* Cancellation Policy Banner */}
        <View style={styles.policyCalloutBanner}>
          <AlertCircle size={18} color={colors.primary} />
          <Text style={styles.policyCalloutText}>
            You can cancel for free up to 2 hours before the scheduled time. If cancelled later, a small fee may apply.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onConfirmCancel} style={styles.dangerPillBtn}>
          <Text style={styles.dangerPillBtnText}>Cancel Booking</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 22. CANCELLATION / REFUND STATUS SCREEN ──────────────────────────────────
function CancellationRefundView({
  onContactSupport,
  onBack,
}: {
  onContactSupport: () => void;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader
        title="Cancellation Details"
        subtitle="Booking ID #NF12345"
        onBack={onBack}
        rightAction={
          <View style={styles.statusTagCancelled}>
            <Text style={styles.statusTextCancelled}>Cancelled</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.bookingDetailsScroll}>
        {/* Cancelled Banner Card */}
        <View style={styles.cancelledBannerCard}>
          <AlertCircle size={24} color="#EF4444" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cancelledBannerTitle}>Booking Cancelled</Text>
            <Text style={styles.cancelledBannerSub}>
              Your booking has been cancelled successfully.
            </Text>
          </View>
        </View>

        {/* Refund Information */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Refund Information</Text>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Refund Amount</Text>
            <Text style={styles.receiptValueBold}>₹299</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Refund Method</Text>
            <Text style={styles.receiptValue}>UPI (Google Pay)</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Refund Status</Text>
            <View style={styles.statusTagCompleted}>
              <Text style={styles.statusTextCompleted}>Refund Processed</Text>
            </View>
          </View>
        </View>

        {/* Refund Timeline */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Refund Timeline</Text>
          <View style={styles.timelineList}>
            <View style={styles.timelineRow}>
              <CheckCircle2 size={18} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.timelineTitleDone}>Cancellation Initiated</Text>
                <Text style={styles.timelineTimeSub}>16 Sep 2024, 09:30 AM</Text>
              </View>
            </View>
            <View style={styles.timelineRow}>
              <CheckCircle2 size={18} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.timelineTitleDone}>Refund Processing</Text>
                <Text style={styles.timelineTimeSub}>16 Sep 2024, 09:35 AM</Text>
              </View>
            </View>
            <View style={styles.timelineRow}>
              <CheckCircle2 size={18} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.timelineTitleDone}>Refund Completed</Text>
                <Text style={styles.timelineTimeSub}>16 Sep 2024, 11:20 AM</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onContactSupport} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Contact Support</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 24. PROFILE SCREEN ───────────────────────────────────────────────────────
function ProfileView({
  onEditProfile,
  onMyBookings,
  onSavedAddresses,
  onPaymentMethods,
  onHelpSupport,
  onLogout,
  onTabChange,
}: {
  onEditProfile: () => void;
  onMyBookings: () => void;
  onSavedAddresses: () => void;
  onPaymentMethods: () => void;
  onHelpSupport: () => void;
  onLogout: () => void;
  onTabChange: (screen: Screen) => void;
}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <View style={styles.profileTopHeader}>
        <Text style={styles.headerTitleText}>Profile</Text>
        <Pressable onPress={onEditProfile} style={styles.profileEditIconBtn}>
          <Paintbrush size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.profileScrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileUserCard}>
          <View style={styles.profileAvatarBox}>
            <UserRound size={36} color={colors.primary} />
          </View>
          <Text style={styles.profileUserName}>Mayank Joshi</Text>
          <Text style={styles.profileUserPhone}>+91 98765 43210</Text>
          <Text style={styles.profileUserEmail}>mayank.joshi@example.com</Text>
        </View>

        {/* Menu Items List */}
        <View style={styles.profileMenuCard}>
          <Pressable onPress={onMyBookings} style={styles.profileMenuItem}>
            <CalendarDays size={20} color={colors.primary} />
            <Text style={styles.profileMenuLabel}>My Bookings</Text>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.profileMenuDivider} />

          <Pressable onPress={onSavedAddresses} style={styles.profileMenuItem}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.profileMenuLabel}>Saved Addresses</Text>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.profileMenuDivider} />

          <Pressable onPress={onPaymentMethods} style={styles.profileMenuItem}>
            <CreditCard size={20} color={colors.primary} />
            <Text style={styles.profileMenuLabel}>Payment Methods</Text>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.profileMenuDivider} />

          <Pressable style={styles.profileMenuItem}>
            <Bell size={20} color={colors.primary} />
            <Text style={styles.profileMenuLabel}>Notifications</Text>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.profileMenuDivider} />

          <Pressable onPress={onHelpSupport} style={styles.profileMenuItem}>
            <HelpCircle size={20} color={colors.primary} />
            <Text style={styles.profileMenuLabel}>Help & Support</Text>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.profileMenuDivider} />

          <Pressable style={styles.profileMenuItem}>
            <Sliders size={20} color={colors.primary} />
            <Text style={styles.profileMenuLabel}>Settings</Text>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.profileMenuDivider} />

          <Pressable onPress={onLogout} style={styles.profileMenuItem}>
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.profileMenuLabel, { color: '#EF4444' }]}>Logout</Text>
            <ChevronRight size={18} color="#EF4444" />
          </Pressable>
        </View>
      </ScrollView>

      <BottomNavigation active="profile" onNavigate={onTabChange} />
    </SafeAreaView>
  );
}

// ─── 25. EDIT PROFILE SCREEN ──────────────────────────────────────────────────
function EditProfileView({
  onSave,
  onBack,
}: {
  onSave: () => void;
  onBack: () => void;
}) {
  const [name, setName] = useState('Mayank Joshi');
  const [phone, setPhone] = useState('98765 43210');
  const [email, setEmail] = useState('mayank.joshi@example.com');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Edit Profile" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent} keyboardShouldPersistTaps="handled">
        {/* Avatar with Camera Badge */}
        <View style={styles.editAvatarCenterBox}>
          <View style={styles.editAvatarCircle}>
            <UserRound size={42} color={colors.primary} />
            <View style={styles.editAvatarCameraBadge}>
              <Camera size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <Text style={styles.bookingSectionLabel}>Full Name</Text>
        <View style={styles.authInputWrap}>
          <TextInput value={name} onChangeText={setName} style={styles.authTextInput} />
        </View>

        <Text style={styles.bookingSectionLabel}>Phone Number</Text>
        <View style={styles.authInputWrap}>
          <Text style={styles.authCountryCode}>+91</Text>
          <View style={styles.authInputDivider} />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.authTextInput}
          />
        </View>

        <Text style={styles.bookingSectionLabel}>Email Address</Text>
        <View style={styles.authInputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.authTextInput}
          />
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onSave} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Save Changes</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 26. SAVED ADDRESSES SCREEN ───────────────────────────────────────────────
function SavedAddressesView({ onBack }: { onBack: () => void }) {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [selectedId, setSelectedId] = useState('addr-1');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Saved Addresses" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        {addresses.map((a) => {
          const isSel = selectedId === a.id;
          return (
            <Pressable
              key={a.id}
              onPress={() => setSelectedId(a.id)}
              style={[styles.savedAddressCard, isSel && styles.savedAddressCardActive]}
            >
              <View style={styles.savedAddressIconBox}>
                <HomeIcon size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.savedAddressType}>{a.type}</Text>
                  {a.isDefault && (
                    <View style={styles.defaultPillTag}>
                      <Text style={styles.defaultPillText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.savedAddressText}>{a.address}</Text>
              </View>
              <View style={[styles.addressRadioCircle, isSel && styles.addressRadioCircleActive]}>
                {isSel && <View style={styles.addressRadioDot} />}
              </View>
            </Pressable>
          );
        })}

        <Pressable style={styles.addAddressOutlineBtn}>
          <Plus size={16} color={colors.primary} />
          <Text style={styles.addAddressOutlineText}>+ Add New Address</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 27. PAYMENT METHODS SCREEN ───────────────────────────────────────────────
function PaymentMethodsView({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Payment Methods" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent}>
        {/* UPI Section */}
        <Text style={styles.bookingSectionLabel}>UPI</Text>
        <View style={styles.detailsCard}>
          <View style={styles.paymentMethodRow}>
            <Text style={styles.upiGoogleLogo}>G Pay</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentMethodTitle}>Google Pay</Text>
              <Text style={styles.paymentMethodSub}>mayank@okaxis</Text>
            </View>
            <View style={styles.defaultPillTag}>
              <Text style={styles.defaultPillText}>Default</Text>
            </View>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.paymentMethodRow}>
            <Text style={styles.upiPhonePeLogo}>पे</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentMethodTitle}>PhonePe</Text>
              <Text style={styles.paymentMethodSub}>mayank@ybl</Text>
            </View>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.paymentMethodRow}>
            <Text style={styles.upiPaytmLogo}>Paytm</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentMethodTitle}>Paytm</Text>
              <Text style={styles.paymentMethodSub}>9876543210</Text>
            </View>
          </View>
        </View>

        {/* Cards Section */}
        <Text style={styles.bookingSectionLabel}>Cards</Text>
        <View style={styles.detailsCard}>
          <View style={styles.paymentMethodRow}>
            <CreditCard size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentMethodTitle}>•••• •••• •••• 4321</Text>
              <Text style={styles.paymentMethodSub}>Expires 12/26</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.addAddressOutlineBtn}>
          <Plus size={16} color={colors.primary} />
          <Text style={styles.addAddressOutlineText}>+ Add Payment Method</Text>
        </Pressable>

        {/* Security Badge */}
        <View style={styles.paymentSecurityBanner}>
          <ShieldCheck size={20} color="#10B981" />
          <Text style={styles.paymentSecurityText}>
            Your payment information is secure and encrypted.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 28. HELP & SUPPORT SCREEN ────────────────────────────────────────────────
function HelpSupportView({
  onRaiseComplaint,
  onBack,
  onTabChange,
}: {
  onRaiseComplaint: () => void;
  onBack?: () => void;
  onTabChange: (screen: Screen) => void;
}) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Help & Support" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.locationSearchWrap}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search for help..."
            placeholderTextColor="#94A3B8"
            style={styles.locationSearchInput}
          />
        </View>

        {/* FAQ Categories Grid */}
        <Text style={styles.bookingSectionLabel}>FAQ Categories</Text>
        <View style={styles.faqCategoryGrid}>
          {faqCategories.map((c) => (
            <View key={c.id} style={styles.faqCategoryCard}>
              {renderDynamicIcon(c.icon, 22, colors.primary)}
              <Text style={styles.faqCategoryTitle}>{c.title}</Text>
              <Text style={styles.faqCategorySub}>{c.sub}</Text>
            </View>
          ))}
        </View>

        {/* Popular Questions Accordion */}
        <Text style={styles.bookingSectionLabel}>Popular Questions</Text>
        {popularFaqs.map((faq, i) => {
          const isOpen = expandedFaq === i;
          return (
            <Pressable
              key={i}
              onPress={() => setExpandedFaq(isOpen ? null : i)}
              style={styles.faqAccordionCard}
            >
              <View style={styles.faqAccordionHeader}>
                <Text style={styles.faqAccordionQuestion}>{faq.q}</Text>
                {isOpen ? (
                  <ChevronUp size={18} color={colors.primary} />
                ) : (
                  <ChevronDown size={18} color="#94A3B8" />
                )}
              </View>
              {isOpen && <Text style={styles.faqAccordionAnswer}>{faq.a}</Text>}
            </Pressable>
          );
        })}

        <Pressable onPress={onRaiseComplaint} style={styles.raiseComplaintBanner}>
          <AlertCircle size={20} color="#FFFFFF" />
          <Text style={styles.raiseComplaintBannerText}>Raise Complaint / Support Ticket</Text>
          <ChevronRight size={18} color="#FFFFFF" />
        </Pressable>
      </ScrollView>

      <BottomNavigation active="support" onNavigate={onTabChange} />
    </SafeAreaView>
  );
}

// ─── 29. RAISE COMPLAINT / SUPPORT TICKET SCREEN ──────────────────────────────
function RaiseComplaintView({
  onSubmitTicket,
  onBack,
}: {
  onSubmitTicket: () => void;
  onBack: () => void;
}) {
  const [issue, setIssue] = useState('');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Raise Complaint" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent} keyboardShouldPersistTaps="handled">
        {/* Select Booking */}
        <Text style={styles.bookingSectionLabel}>Select Booking (Optional)</Text>
        <View style={styles.dropdownPickerCard}>
          <Wrench size={18} color="#F59E0B" />
          <View style={{ flex: 1 }}>
            <Text style={styles.dropdownPickerTitle}>#NF12345 - Electrician</Text>
            <Text style={styles.dropdownPickerSub}>17 Sep 2024, 11:00 AM</Text>
          </View>
          <ChevronDown size={18} color="#94A3B8" />
        </View>

        {/* Issue Category */}
        <Text style={styles.bookingSectionLabel}>Issue Category</Text>
        <View style={styles.dropdownPickerCard}>
          <Text style={styles.dropdownPickerTitle}>Service Quality</Text>
          <ChevronDown size={18} color="#94A3B8" />
        </View>

        {/* Describe Your Issue */}
        <Text style={styles.bookingSectionLabel}>Describe Your Issue</Text>
        <View style={styles.bookingTextAreaWrap}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Please describe the issue in detail..."
            placeholderTextColor="#94A3B8"
            value={issue}
            onChangeText={setIssue}
            maxLength={500}
            style={styles.bookingTextArea}
          />
          <Text style={styles.charCountText}>{issue.length}/500</Text>
        </View>

        {/* Upload Photos / Videos */}
        <Text style={styles.bookingSectionLabel}>Upload Photos / Videos (Optional)</Text>
        <View style={styles.ticketUploadBox}>
          <Camera size={22} color={colors.primary} />
          <Text style={styles.ticketUploadText}>Upload Photos / Videos</Text>
          <Text style={styles.ticketUploadSub}>Supports: JPG, PNG, MP4 (Max 50MB)</Text>
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onSubmitTicket} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Submit Ticket</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── 30. RATING & REVIEW SCREEN ───────────────────────────────────────────────
function RateReviewView({
  onSubmitReview,
  onBack,
}: {
  onSubmitReview: () => void;
  onBack: () => void;
}) {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Professional', 'On Time']);

  const feedbackTags = [
    'Professional',
    'On Time',
    'Good Quality',
    'Friendly',
    'Value for Money',
    'Clean Work',
  ];

  const toggleTag = (t: string) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <ScreenHeader title="Rate Your Experience" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.bookingScrollContent} keyboardShouldPersistTaps="handled">
        {/* Service Summary Card */}
        <View style={styles.detailsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Zap size={22} color="#F59E0B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailsServiceName}>Electrician</Text>
              <Text style={styles.detailsServiceSub}>Booking ID: #NF12345</Text>
              <Text style={styles.detailsServiceDate}>17 Sep 2024, 11:00 AM</Text>
            </View>
            <View style={styles.statusTagCompleted}>
              <Text style={styles.statusTextCompleted}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Provider Card */}
        <View style={styles.detailsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.trackingProviderAvatarBox}>
              <UserRound size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trackingProviderName}>Rohit Sharma</Text>
              <Text style={styles.trackingProviderRating}>★ 4.8 (120 reviews)</Text>
            </View>
          </View>
        </View>

        {/* Rate Your Provider Golden Stars */}
        <Text style={[styles.bookingSectionLabel, { textAlign: 'center', marginTop: 16 }]}>
          Rate Your Provider
        </Text>
        <View style={styles.ratingStarsRow}>
          {[1, 2, 3, 4, 5].map((val) => (
            <Pressable key={val} onPress={() => setStars(val)} style={styles.ratingStarBtn}>
              <Star
                size={34}
                color="#F59E0B"
                fill={val <= stars ? '#F59E0B' : 'transparent'}
                strokeWidth={1.8}
              />
            </Pressable>
          ))}
        </View>

        {/* Write a Review */}
        <Text style={styles.bookingSectionLabel}>Write a Review (Optional)</Text>
        <View style={styles.bookingTextAreaWrap}>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Share your experience..."
            placeholderTextColor="#94A3B8"
            value={review}
            onChangeText={setReview}
            maxLength={300}
            style={styles.bookingTextArea}
          />
          <Text style={styles.charCountText}>{review.length}/300</Text>
        </View>

        {/* Quick Feedback Chips */}
        <Text style={styles.bookingSectionLabel}>Quick Feedback</Text>
        <View style={styles.feedbackChipsRow}>
          {feedbackTags.map((t) => {
            const isSel = selectedTags.includes(t);
            return (
              <Pressable
                key={t}
                onPress={() => toggleTag(t)}
                style={[styles.feedbackChip, isSel && styles.feedbackChipSelected]}
              >
                <Text style={[styles.feedbackChipText, isSel && styles.feedbackChipTextSelected]}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bookingFooterBar}>
        <Pressable onPress={onSubmitReview} style={styles.primaryPillBtn}>
          <Text style={styles.primaryPillBtnText}>Submit Review</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── ROOT APP COMPONENT (Full 30-Screen Flow Controller) ──────────────────────
export default function Index() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [screen, setScreen] = useState<Screen>('splash');
  const [history, setHistory] = useState<Screen[]>([]);
  const [location, setLocation] = useState('Bikaner, Rajasthan');
  const [phone, setPhone] = useState('9876543210');
  const [toastMsg, setToastMsg] = useState('');

  // Show temporary toast notification
  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2400);
  };

  // Forward navigation
  const navigate = (next: Screen) => {
    setHistory((prev) => [...prev, screen]);
    setScreen(next);
  };

  // Back navigation
  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setScreen(prev);
    } else {
      setScreen('home');
    }
  };

  // Root view renderer
  const screenContent = useMemo(() => {
    if (!fontsLoaded) return null;

    switch (screen) {
      // 1. Splash Screen
      case 'splash':
        return <SplashScreenView onComplete={() => navigate('onboarding')} />;

      // 2. Onboarding
      case 'onboarding':
        return (
          <OnboardingScreenView
            onGetStarted={() => navigate('auth')}
            onSkip={() => navigate('auth')}
          />
        );

      // 3. Login / Sign Up
      case 'auth':
        return (
          <AuthScreenView
            onAuthenticate={(p) => {
              setPhone(p);
              navigate('otp');
            }}
            onForgotPassword={() => notify('Reset link sent to registered phone (Demo)')}
          />
        );

      // 4. OTP Verification (Entered ONCE)
      case 'otp':
        return (
          <OtpVerificationView
            phone={phone}
            onVerify={() => {
              notify('Phone verified successfully!');
              navigate('location');
            }}
            onBack={goBack}
          />
        );

      // 5. Location Selector
      case 'location':
        return (
          <LocationSelectorView
            selectedLocation={location}
            onSelect={(loc) => setLocation(loc)}
            onConfirm={() => navigate('home')}
            onBack={goBack}
          />
        );

      // 6. Home Dashboard
      case 'home':
        return (
          <HomeDashboardView
            location={location}
            onOpenLocation={() => navigate('location')}
            onOpenCategories={() => navigate('categories')}
            onSelectCategory={() => navigate('serviceDetails')}
            onSearch={() => navigate('search')}
            onBookNow={() => navigate('serviceDetails')}
            onTabChange={(s) => navigate(s)}
          />
        );

      // 7. Service Categories (All Services)
      case 'categories':
        return (
          <AllServicesView
            onSelectCategory={() => navigate('serviceDetails')}
            onBack={goBack}
            onTabChange={(s) => navigate(s)}
          />
        );

      // 8. Service Details
      case 'serviceDetails':
        return (
          <ServiceDetailsView
            onBookNow={() => navigate('bookRequirements')}
            onBack={goBack}
          />
        );

      // 9. Search & Results
      case 'search':
        return (
          <SearchResultsView
            onSelectService={() => navigate('serviceDetails')}
            onBack={goBack}
          />
        );

      // 10. Booking Step 1: Requirements
      case 'bookRequirements':
        return <BookRequirementsView onNext={() => navigate('bookMedia')} onBack={goBack} />;

      // 11. Booking Step 2: Upload Photo / Video
      case 'bookMedia':
        return <BookMediaView onNext={() => navigate('bookAddress')} onBack={goBack} />;

      // 12. Booking Step 3: Address + Map Location
      case 'bookAddress':
        return <BookAddressView onNext={() => navigate('bookSchedule')} onBack={goBack} />;

      // 13. Booking Step 4: Schedule Date & Time
      case 'bookSchedule':
        return <BookScheduleView onNext={() => navigate('bookConfirm')} onBack={goBack} />;

      // 14. Booking Step 5: Price & Summary
      case 'bookConfirm':
        return (
          <BookConfirmView
            onConfirm={() => navigate('providerStatus')}
            onBack={goBack}
          />
        );

      // 15. Provider Matching & Radar Status
      case 'providerStatus':
        return <ProviderStatusView onMatched={() => navigate('liveTracking')} />;

      // 16. Live Tracking + Payment
      case 'liveTracking':
        return <LiveTrackingView onPayNow={() => navigate('bookingSuccess')} onBack={goBack} />;

      // 17. Booking Success / Confirmation
      case 'bookingSuccess':
        return (
          <BookingSuccessView
            onViewBooking={() => navigate('bookingDetails')}
            onGoHome={() => navigate('home')}
          />
        );

      // 18. My Bookings
      case 'myBookings':
        return (
          <MyBookingsView
            onViewDetails={() => navigate('bookingDetails')}
            onReschedule={() => navigate('rescheduleBooking')}
            onCancel={() => navigate('cancelBooking')}
            onRate={() => navigate('rateReview')}
            onTabChange={(s) => navigate(s)}
          />
        );

      // 19. Booking Details
      case 'bookingDetails':
        return (
          <BookingDetailsView
            onReschedule={() => navigate('rescheduleBooking')}
            onCancel={() => navigate('cancelBooking')}
            onBack={goBack}
          />
        );

      // 20. Reschedule Booking
      case 'rescheduleBooking':
        return (
          <RescheduleBookingView
            onConfirmReschedule={() => {
              notify('Booking rescheduled successfully!');
              navigate('myBookings');
            }}
            onBack={goBack}
          />
        );

      // 21. Cancel Booking
      case 'cancelBooking':
        return (
          <CancelBookingView
            onConfirmCancel={() => navigate('cancellationRefund')}
            onBack={goBack}
          />
        );

      // 22. Cancellation / Refund Status
      case 'cancellationRefund':
        return (
          <CancellationRefundView
            onContactSupport={() => navigate('helpSupport')}
            onBack={goBack}
          />
        );

      // 24. Profile
      case 'profile':
        return (
          <ProfileView
            onEditProfile={() => navigate('editProfile')}
            onMyBookings={() => navigate('myBookings')}
            onSavedAddresses={() => navigate('savedAddresses')}
            onPaymentMethods={() => navigate('paymentMethods')}
            onHelpSupport={() => navigate('helpSupport')}
            onLogout={() => {
              notify('Logged out successfully');
              navigate('auth');
            }}
            onTabChange={(s) => navigate(s)}
          />
        );

      // 25. Edit Profile
      case 'editProfile':
        return (
          <EditProfileView
            onSave={() => {
              notify('Profile updated!');
              navigate('profile');
            }}
            onBack={goBack}
          />
        );

      // 26. Saved Addresses
      case 'savedAddresses':
        return <SavedAddressesView onBack={goBack} />;

      // 27. Payment Methods
      case 'paymentMethods':
        return <PaymentMethodsView onBack={goBack} />;

      // 28. Help & Support
      case 'helpSupport':
        return (
          <HelpSupportView
            onRaiseComplaint={() => navigate('raiseComplaint')}
            onBack={goBack}
            onTabChange={(s) => navigate(s)}
          />
        );

      // 29. Raise Complaint / Ticket
      case 'raiseComplaint':
        return (
          <RaiseComplaintView
            onSubmitTicket={() => {
              notify('Complaint ticket #TK9812 submitted!');
              navigate('helpSupport');
            }}
            onBack={goBack}
          />
        );

      // 30. Rating & Review
      case 'rateReview':
        return (
          <RateReviewView
            onSubmitReview={() => {
              notify('Thank you for your feedback!');
              navigate('myBookings');
            }}
            onBack={goBack}
          />
        );

      default:
        return (
          <HomeDashboardView
            location={location}
            onOpenLocation={() => navigate('location')}
            onOpenCategories={() => navigate('categories')}
            onSelectCategory={() => navigate('serviceDetails')}
            onSearch={() => navigate('search')}
            onBookNow={() => navigate('serviceDetails')}
            onTabChange={(s) => navigate(s)}
          />
        );
    }
  }, [fontsLoaded, screen, location, phone, history]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {screenContent}
      <Toast text={toastMsg} />
    </KeyboardAvoidingView>
  );
}

// ─── COMPREHENSIVE STYLESHEET ─────────────────────────────────────────────────
const CARD_SHADOW = {
  shadowColor: '#0F1B3D',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Toast
  toastContainer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 6,
    zIndex: 9999,
  },
  toastText: {
    color: '#FFFFFF',
    fontFamily: typography.medium,
    fontSize: 13,
  },

  // Screen Header
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  headerBarNoBack: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitleText: {
    fontFamily: typography.bold,
    fontSize: 17,
    color: colors.navy,
  },
  headerSubtitleText: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  // Bottom Navigation Bar
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
    elevation: 8,
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 2,
    minWidth: 64,
  },
  bottomNavIconWrap: {
    padding: 4,
  },
  bottomNavIconActive: {},
  bottomNavLabel: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: '#94A3B8',
  },
  bottomNavLabelActive: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },

  // 1. Splash Screen
  splashContainer: {
    flex: 1,
    backgroundColor: '#1E62C1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  splashWatermarkTopLeft: {
    position: 'absolute',
    top: 60,
    left: -20,
    transform: [{ rotate: '-15deg' }],
  },
  splashWatermarkBottomRight: {
    position: 'absolute',
    bottom: 100,
    right: -20,
    transform: [{ rotate: '15deg' }],
  },
  splashWatermarkMidRight: {
    position: 'absolute',
    top: '35%',
    right: -10,
  },
  splashCenterContent: {
    alignItems: 'center',
  },
  splashLogoBox: {
    width: 250,
    height: 140,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  splashLogoRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  splashLogoNow: {
    fontFamily: typography.bold,
    fontSize: 42,
    color: '#FFFFFF',
    letterSpacing: 2,
    lineHeight: 46,
  },
  splashLogoDivider: {
    height: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
  },
  splashLogoRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  splashLogoFix: {
    fontFamily: typography.bold,
    fontSize: 42,
    color: '#FFFFFF',
    letterSpacing: 2,
    lineHeight: 46,
  },
  splashToolsWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTaglineTop: {
    fontFamily: typography.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 2.5,
    marginTop: 22,
    textAlign: 'center',
  },
  splashTaglineBottom: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: '#F59E0B',
    letterSpacing: 2.5,
    marginTop: 4,
    textAlign: 'center',
  },
  splashBottomFooter: {
    position: 'absolute',
    bottom: 50,
    width: '60%',
    alignItems: 'center',
  },
  splashProgressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  splashProgressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  splashLoadingText: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },

  // 2. Onboarding
  onboardingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipBtnText: {
    fontFamily: typography.semibold,
    color: '#64748B',
    fontSize: 14,
  },
  onboardingContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  onboardingMascotBox: {
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  onboardingMascotImg: {
    width: '100%',
    height: '100%',
  },
  onboardingTitle: {
    fontFamily: typography.bold,
    fontSize: 26,
    lineHeight: 34,
    color: colors.navy,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
  },
  carouselDotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  carouselDotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  onboardingFooter: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryPillBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
  },
  primaryPillBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 16,
  },
  secondaryOutlineBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryOutlineBtnText: {
    color: colors.navy,
    fontFamily: typography.semibold,
    fontSize: 15,
  },
  dangerPillBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerPillBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 16,
  },

  // 3. Auth Screen
  authScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  authHeaderBox: {
    marginTop: 12,
    marginBottom: 20,
  },
  authMainTitle: {
    fontFamily: typography.medium,
    fontSize: 16,
    color: '#64748B',
  },
  authBrandTitle: {
    fontFamily: typography.bold,
    fontSize: 28,
    color: colors.primary,
    marginTop: 2,
  },
  authSubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  authTabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  authTabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  authTabItemActive: {
    backgroundColor: '#FFFFFF',
    ...CARD_SHADOW,
  },
  authTabText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: '#64748B',
  },
  authTabTextActive: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },
  authFormContainer: {
    gap: 12,
  },
  authInputWrap: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  authCountryCode: {
    fontFamily: typography.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  authInputDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
  },
  authTextInput: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.navy,
    paddingVertical: 0,
  },
  forgotPassBtn: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  forgotPassText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.primary,
  },
  formErrorText: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#EF4444',
  },
  authSubmitBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    ...CARD_SHADOW,
  },
  authSubmitBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 16,
  },
  authOrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  authOrLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  authOrText: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
  socialAuthBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialGoogleG: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: '#4285F4',
  },
  socialAppleLogo: {
    fontSize: 18,
    color: '#0F172A',
  },
  socialAuthBtnText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.navy,
  },
  authFooterLink: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  authFooterLinkNormal: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#64748B',
  },
  authFooterLinkHighlight: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },

  // 4. OTP Verification
  otpHeaderBox: {
    paddingHorizontal: 24,
    marginTop: 10,
    alignItems: 'center',
  },
  otpMainTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.navy,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 24,
  },
  otpDigitBox: {
    width: 54,
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigitBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  otpDigitText: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.navy,
  },
  otpResendTimer: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
  keypadContainer: {
    marginTop: 'auto',
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  keypadBtn: {
    width: 68,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadKeyText: {
    fontFamily: typography.semibold,
    fontSize: 20,
    color: colors.navy,
  },

  // 5. Location Selector
  locationScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 100,
  },
  locationSearchWrap: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 16,
  },
  locationSearchInput: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.navy,
  },
  locationMapCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  locationMapBg: {
    flex: 1,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapGridLine1: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#F1F5F9',
  },
  mapGridLine2: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#F1F5F9',
  },
  mapGridLine3: {
    position: 'absolute',
    left: 80,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#F1F5F9',
  },
  mapPinCallout: {
    alignItems: 'center',
  },
  mapPinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    ...CARD_SHADOW,
    marginBottom: 4,
  },
  mapPinText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.navy,
  },
  mapPinIconCircle: {},
  useCurrentLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    ...CARD_SHADOW,
  },
  useCurrentLocText: {
    fontFamily: typography.semibold,
    fontSize: 14,
    color: colors.primary,
  },
  sectionHeadingText: {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.navy,
    marginBottom: 10,
  },
  citiesChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cityChipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  cityChipText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: '#64748B',
  },
  cityChipTextSelected: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },
  locationFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },

  // 6. Home Dashboard
  homeScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 90,
  },
  homeTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  homeLocationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    maxWidth: 220,
  },
  homeLocationText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.primary,
    flex: 1,
  },
  homeBellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  homeBellBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  homeGreetingBox: {
    marginBottom: 12,
  },
  homeGreetingText: {
    fontFamily: typography.regular,
    fontSize: 20,
    color: colors.navy,
  },
  homeSearchCard: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 16,
    ...CARD_SHADOW,
  },
  homeSearchPlaceholder: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#94A3B8',
  },
  homePromoCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  homePromoTextWrap: {
    flex: 1,
  },
  homePromoTitle: {
    fontFamily: typography.bold,
    fontSize: 18,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  homePromoSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#DBEAFE',
    marginTop: 4,
  },
  homePromoBookBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  homePromoBookText: {
    color: '#FFFFFF',
    fontFamily: typography.bold,
    fontSize: 12,
  },
  homePromoMascotWrap: {
    width: 100,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homePromoMascotImg: {
    width: '100%',
    height: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontSize: 16,
    color: colors.navy,
  },
  sectionSeeAll: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  homeServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  homeServiceItemCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...CARD_SHADOW,
    marginBottom: 4,
  },
  homeServiceIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  homeServiceName: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.navy,
    textAlign: 'center',
    lineHeight: 15,
  },
  homeTrustStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...CARD_SHADOW,
  },
  homeTrustItem: {
    alignItems: 'center',
    gap: 4,
  },
  homeTrustText: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#64748B',
  },
  homeTrustDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },

  // 7. All Services (Categories)
  categoriesFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  categoryFilterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  categoryFilterChipActive: {
    backgroundColor: colors.primary,
  },
  categoryFilterChipText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: '#64748B',
  },
  categoryFilterChipTextActive: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
  },
  allServicesList: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 90,
    gap: 10,
  },
  allServiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...CARD_SHADOW,
  },
  allServiceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allServiceTitle: {
    fontFamily: typography.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  allServiceSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // 8. Service Details
  serviceDetailsScroll: {
    paddingBottom: 90,
  },
  serviceDetailsBanner: {
    height: 200,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceDetailsBannerOverlay: {
    alignItems: 'center',
    gap: 8,
  },
  serviceDetailsBannerTag: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: '#DBEAFE',
  },
  serviceDetailsHeaderCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  serviceDetailsTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.navy,
  },
  serviceDetailsRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  serviceDetailsRatingText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: '#64748B',
  },
  serviceDetailsTrustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  serviceDetailsTrustCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...CARD_SHADOW,
  },
  serviceDetailsTrustText: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
  },
  serviceDetailsAboutCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...CARD_SHADOW,
  },
  serviceDetailsSectionTitle: {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.navy,
    marginBottom: 6,
  },
  serviceDetailsAboutBody: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
  },
  serviceDetailsFooterBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDetailsPriceLabel: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
  },
  serviceDetailsPriceValue: {
    fontFamily: typography.bold,
    fontSize: 20,
    color: colors.primary,
  },
  serviceDetailsPriceDetails: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.primary,
  },
  serviceDetailsBookBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    ...CARD_SHADOW,
  },
  serviceDetailsBookBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 15,
  },

  // 9. Search & Results
  searchTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchBarInputWrap: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchBarRealInput: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.navy,
  },
  searchFilterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  searchResultsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 10,
  },
  searchResultsCount: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  searchResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...CARD_SHADOW,
  },
  searchResultIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultTitle: {
    fontFamily: typography.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  searchResultSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  searchResultMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  searchResultRating: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#64748B',
  },
  searchResultPrice: {
    fontFamily: typography.semibold,
    fontSize: 11,
    color: colors.primary,
    marginLeft: 6,
  },

  // Booking Flow Stepper
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepperItem: {
    alignItems: 'center',
  },
  stepperCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepperCircleDone: {
    backgroundColor: '#10B981',
  },
  stepperCircleActive: {
    backgroundColor: colors.primary,
  },
  stepperNumber: {
    fontFamily: typography.semibold,
    fontSize: 11,
    color: '#64748B',
  },
  stepperNumberActive: {
    color: '#FFFFFF',
  },
  stepperLabel: {
    fontFamily: typography.regular,
    fontSize: 9,
    color: '#94A3B8',
  },
  stepperLabelActive: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  stepperLineDone: {
    backgroundColor: '#10B981',
  },
  bookingScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  bookingSectionLabel: {
    fontFamily: typography.bold,
    fontSize: 14,
    color: colors.navy,
    marginBottom: 8,
    marginTop: 12,
  },
  bookingServiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bookingServiceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingServiceName: {
    fontFamily: typography.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  bookingServicePrice: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.primary,
    marginTop: 1,
  },
  bookingTextAreaWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  bookingTextArea: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.navy,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCountText: {
    fontFamily: typography.regular,
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'right',
  },
  serviceTypeChipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  serviceTypeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  serviceTypeChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  serviceTypeChipText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: '#64748B',
  },
  serviceTypeChipTextActive: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },
  bookingFooterBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },

  // 11. Booking Step 2: Media
  mediaUploadDropzone: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaUploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...CARD_SHADOW,
  },
  mediaUploadTitle: {
    fontFamily: typography.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  mediaUploadSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  mediaUploadFormats: {
    fontFamily: typography.regular,
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  mediaThumbnailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  mediaThumbnailBox: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mediaThumbText: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.primary,
    marginTop: 4,
  },
  mediaThumbRemoveBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  addMoreBtnText: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.primary,
  },

  // 12. Booking Step 3: Address
  addressRadioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  addressRadioCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  addressRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressRadioCircleActive: {
    borderColor: colors.primary,
  },
  addressRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  addressTypeTitle: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.navy,
  },
  addressTextBody: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  addressEditLink: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.primary,
  },
  addAddressOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  addAddressOutlineText: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  mapPreviewCard: {
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  mapPreviewBg: {
    flex: 1,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  useThisLocBtn: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  useThisLocText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 13,
  },

  // 13. Booking Step 4: Schedule
  scheduleDatesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  scheduleDatePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  scheduleDatePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  scheduleDateText: {
    fontFamily: typography.medium,
    fontSize: 11,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 15,
  },
  scheduleDateTextActive: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
  },
  slotRadioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  slotRadioCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  slotText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.navy,
  },
  slotTextActive: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },
  emergencyBookingCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  emergencyTitle: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: '#92400E',
  },
  emergencySub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },

  // 14. Booking Step 5: Price & Summary
  priceBreakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#64748B',
  },
  priceVal: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.navy,
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  priceTotalLabel: {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.navy,
  },
  priceTotalVal: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: colors.primary,
  },
  applyCouponRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  applyCouponText: {
    flex: 1,
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.navy,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItemLabel: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#64748B',
  },
  summaryItemValue: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.navy,
  },

  // 15. Provider Matching Radar
  providerMatchingContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerMatchingTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.navy,
    textAlign: 'center',
  },
  providerMatchingSub: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 30,
  },
  radarPulseContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarOuterCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarMidCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCenterCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  matchingChecklistCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matchingStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  matchingStepDoneText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: '#10B981',
  },
  matchingStepCurrentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 4,
  },
  matchingStepCurrentText: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  matchingStepIdleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
    marginLeft: 4,
  },
  matchingStepIdleText: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#94A3B8',
  },
  matchingTimeNote: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 16,
  },

  // 16. Live Tracking
  liveTrackingScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 90,
    gap: 12,
  },
  trackingProviderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trackingProviderAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingProviderName: {
    fontFamily: typography.bold,
    fontSize: 14,
    color: colors.navy,
  },
  trackingProviderRating: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: '#64748B',
  },
  trackingActionBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  trackingRoundActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingEtaCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackingEtaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  trackingEtaTitle: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: '#166534',
  },
  trackingEtaSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#15803D',
  },
  trackingMapBox: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  trackingMapLine: {
    position: 'absolute',
    left: 40,
    right: 40,
    height: 3,
    backgroundColor: colors.primary,
  },
  trackingProviderPin: {
    position: 'absolute',
    left: 60,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  trackingHomePin: {
    position: 'absolute',
    right: 60,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  trackingPaymentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackingPaymentLabel: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
  },
  trackingPaymentAmount: {
    fontFamily: typography.bold,
    fontSize: 20,
    color: colors.primary,
  },
  trackingPaymentMethod: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.primary,
  },
  trackingPayNowBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  trackingPayNowBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 15,
  },

  // 17. Booking Success
  successMainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...CARD_SHADOW,
  },
  successTitle: {
    fontFamily: typography.bold,
    fontSize: 24,
    color: colors.navy,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  successReceiptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#64748B',
  },
  receiptValue: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.navy,
  },
  receiptValueBold: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: colors.primary,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  receiptTotalLabel: {
    fontFamily: typography.bold,
    fontSize: 14,
    color: colors.navy,
  },
  receiptTotalValue: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: colors.primary,
  },

  // 18. My Bookings
  bookingsFilterRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  bookingTabChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  bookingTabChipActive: {
    backgroundColor: colors.primary,
  },
  bookingTabChipText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: '#64748B',
  },
  bookingTabChipTextActive: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
  },
  bookingsListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
    gap: 12,
  },
  bookingItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...CARD_SHADOW,
  },
  bookingItemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookingItemServiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingItemTitle: {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.navy,
  },
  bookingStatusTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  bookingStatusTagText: {
    fontFamily: typography.semibold,
    fontSize: 11,
  },
  statusTagUpcoming: {
    backgroundColor: '#EFF6FF',
  },
  statusTextUpcoming: {
    color: colors.primary,
    fontFamily: typography.semibold,
    fontSize: 11,
  },
  statusTagCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusTextCompleted: {
    color: '#15803D',
    fontFamily: typography.semibold,
    fontSize: 11,
  },
  statusTagCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusTextCancelled: {
    color: '#DC2626',
    fontFamily: typography.semibold,
    fontSize: 11,
  },
  bookingItemSub: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  bookingItemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  bookingItemMetaText: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
  },
  bookingItemProviderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  bookingProviderAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingProviderNameSmall: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.navy,
  },
  bookingProviderRatingSmall: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#F59E0B',
  },
  bookingPriceTag: {
    fontFamily: typography.bold,
    fontSize: 16,
    color: colors.primary,
  },
  bookingItemActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  bookingActionOutlineBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  bookingActionOutlineText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.navy,
  },
  bookingActionPrimaryBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  bookingActionPrimaryText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: '#FFFFFF',
  },

  // 19. Booking Details
  bookingDetailsScroll: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 90,
    gap: 12,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  detailsServiceName: {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.navy,
  },
  detailsServiceSub: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#64748B',
  },
  detailsServiceDate: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
  },
  detailsCallBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsAddressTitle: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.navy,
  },
  detailsAddressSub: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  detailsSectionTitle: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: colors.navy,
    marginBottom: 4,
  },
  detailsBodyText: {
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
  },
  timelineList: {
    gap: 12,
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timelineDotDone: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  timelineTitleDone: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.navy,
  },
  timelineTimeSub: {
    fontFamily: typography.regular,
    fontSize: 10,
    color: '#94A3B8',
  },
  timelineDotPending: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
  },
  timelineTitlePending: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
  detailsActionBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
  },
  detailsRescheduleBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsRescheduleBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 14,
  },
  detailsCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCancelBtnText: {
    color: colors.navy,
    fontFamily: typography.semibold,
    fontSize: 14,
  },

  // 20. Reschedule Booking
  rescheduleDatePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  rescheduleDatePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rescheduleDateText: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: '#64748B',
  },
  rescheduleDateTextActive: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
  },
  emergencyBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  emergencyBannerText: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },

  // 21. Cancel Booking
  policyCalloutBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  policyCalloutText: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
  },

  // 22. Cancellation / Refund Status
  cancelledBannerCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelledBannerTitle: {
    fontFamily: typography.bold,
    fontSize: 14,
    color: '#DC2626',
  },
  cancelledBannerSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 1,
  },

  // 24. Profile
  profileTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  profileEditIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 90,
    gap: 14,
  },
  profileUserCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...CARD_SHADOW,
  },
  profileAvatarBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileUserName: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: colors.navy,
  },
  profileUserPhone: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  profileUserEmail: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  profileMenuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...CARD_SHADOW,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  profileMenuLabel: {
    flex: 1,
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.navy,
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },

  // 25. Edit Profile
  editAvatarCenterBox: {
    alignItems: 'center',
    marginVertical: 12,
  },
  editAvatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  editAvatarCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // 26. Saved Addresses
  savedAddressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  savedAddressCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  savedAddressIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedAddressType: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: colors.navy,
  },
  savedAddressText: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  defaultPillTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultPillText: {
    color: '#15803D',
    fontFamily: typography.semibold,
    fontSize: 10,
  },

  // 27. Payment Methods
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  paymentMethodTitle: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.navy,
  },
  paymentMethodSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
  },
  upiGoogleLogo: {
    fontFamily: typography.bold,
    fontSize: 16,
    color: '#4285F4',
    width: 44,
  },
  upiPhonePeLogo: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: '#5F259F',
    width: 44,
    textAlign: 'center',
  },
  upiPaytmLogo: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: '#00BAF2',
    width: 44,
  },
  paymentSecurityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  paymentSecurityText: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#166534',
  },

  // 28. Help & Support
  faqCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  faqCategoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    ...CARD_SHADOW,
  },
  faqCategoryTitle: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.navy,
    marginTop: 4,
  },
  faqCategorySub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.primary,
  },
  faqAccordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  faqAccordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqAccordionQuestion: {
    flex: 1,
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.navy,
  },
  faqAccordionAnswer: {
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  raiseComplaintBanner: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  raiseComplaintBannerText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 13,
  },

  // 29. Raise Complaint
  dropdownPickerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownPickerTitle: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.navy,
  },
  dropdownPickerSub: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: '#64748B',
  },
  ticketUploadBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    gap: 4,
  },
  ticketUploadText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.navy,
  },
  ticketUploadSub: {
    fontFamily: typography.regular,
    fontSize: 10,
    color: '#94A3B8',
  },

  // 30. Rating & Review
  ratingStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 14,
  },
  ratingStarBtn: {
    padding: 4,
  },
  feedbackChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feedbackChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  feedbackChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.primary,
  },
  feedbackChipText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: '#64748B',
  },
  feedbackChipTextSelected: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },
});
