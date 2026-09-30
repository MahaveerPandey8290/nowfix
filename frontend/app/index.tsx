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
import { LinearGradient } from 'expo-linear-gradient';
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
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  HomeIcon,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
  Camera,
  MessageCircle,
  CalendarDays,
  LockKeyhole,
  Zap,
  Droplets,
  Refrigerator,
  Hammer,
  Paintbrush,
  Bug,
  Snowflake,
  Armchair,
  Cpu,
  CircleEllipsis,
  Navigation,
  RotateCcw,
  Clock3,
  Star,
  Target,
  X,
  HelpCircle,
} from 'lucide-react-native';
import {
  categories,
  popularCities,
  recentLocations,
  recentServices,
  popularServices,
} from '@/src/data/mock';
import { colors, radius, spacing, typography } from '@/src/theme';

type Screen =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'create'
  | 'profile'
  | 'forgot'
  | 'reset'
  | 'location'
  | 'home'
  | 'categories'
  | 'bookings'
  | 'messages'
  | 'profileTab';

type IconName =
  | 'Zap' | 'Droplets' | 'Refrigerator' | 'Sparkles' | 'Hammer'
  | 'Paintbrush' | 'Bug' | 'Snowflake' | 'Armchair' | 'Cpu'
  | 'ShieldCheck' | 'Ellipsis';

const categoryIconMap: Record<IconName, React.ComponentType<any>> = {
  Zap, Droplets, Refrigerator, Sparkles, Hammer, Paintbrush,
  Bug, Snowflake, Armchair, Cpu, ShieldCheck, Ellipsis: CircleEllipsis,
};

const categoryColorMap: Record<IconName, string> = {
  Zap: '#F59E0B',
  Droplets: '#3B82F6',
  Refrigerator: '#3B82F6',
  Sparkles: '#F59E0B',
  Hammer: '#F59E0B',
  Paintbrush: '#F59E0B',
  Bug: '#EF4444',
  Snowflake: '#3B82F6',
  Armchair: '#8B5CF6',
  Cpu: '#3B82F6',
  ShieldCheck: '#3B82F6',
  Ellipsis: '#6B7280',
};

const categoryBgMap: Record<IconName, string> = {
  Zap: '#FEF3C7',
  Droplets: '#DBEAFE',
  Refrigerator: '#EFF6FF',
  Sparkles: '#FEF9C3',
  Hammer: '#FEF3C7',
  Paintbrush: '#FFF7ED',
  Bug: '#FEE2E2',
  Snowflake: '#EFF6FF',
  Armchair: '#EDE9FE',
  Cpu: '#EFF6FF',
  ShieldCheck: '#EFF6FF',
  Ellipsis: '#F3F4F6',
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Toast({ text }: { text: string }) {
  return (
    <View style={styles.toast}>
      <Check size={16} color="#fff" />
      <Text style={styles.toastText}>{text}</Text>
    </View>
  );
}

function PrimaryButton({
  title,
  onPress,
  disabled = false,
  style: extraStyle,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        pressed && { opacity: 0.85 },
        extraStyle,
      ]}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
      <ArrowRight size={20} color="#fff" />
    </Pressable>
  );
}

function LocationPill({ location, onPress }: { location: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.locationPill}>
      <MapPin size={13} color={colors.primary} />
      <Text style={styles.locationPillText} numberOfLines={1}>{location}</Text>
      <ChevronDown size={13} color={colors.primary} />
    </Pressable>
  );
}

function AuthShell({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

function FortFooter() {
  return (
    <View style={styles.fortContainer}>
      <Image
        source={require('../assets/images/fort_footer.png')}
        style={styles.fortImage}
        resizeMode="contain"
      />
    </View>
  );
}

function NowFixLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      source={require('../assets/images/logo_light.png')}
      style={compact ? styles.logoCompact : styles.logoFull}
      resizeMode="contain"
    />
  );
}

// ─── 1. SPLASH SCREEN ─────────────────────────────────────────────────────────
function Splash({ next }: { next: () => void }) {
  useEffect(() => {
    const t = setTimeout(next, 2500);
    return () => clearTimeout(t);
  }, [next]);

  return (
    <Pressable onPress={next} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/splash_screen.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    </Pressable>
  );
}

// ─── 2. ONBOARDING ────────────────────────────────────────────────────────────
function Onboarding({ next }: { next: (s: Screen) => void }) {
  return (
    <AuthShell>
      <View style={styles.topBar}>
        <View style={{ width: 44 }} />
        <Pressable onPress={() => next('login')}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.centered}>
        <NowFixLogo />
      </View>

      <Text style={styles.heroTitle}>
        Reliable Home Services{'\n'}Now Just a Tap Away
      </Text>
      <Text style={styles.bodyCenter}>
        Book verified professionals for electrical, plumbing, appliance repair, cleaning and more in your city.
      </Text>

      <View style={styles.onboardHeroBox}>
        <Image
          source={require('../assets/images/onboard_hero.png')}
          style={styles.onboardHeroImg}
          resizeMode="contain"
        />
      </View>

      <View style={styles.dotsRow}>
        <View style={styles.dotActive} />
        <View style={styles.dotIdle} />
        <View style={styles.dotIdle} />
      </View>

      <PrimaryButton title="Get Started" onPress={() => next('login')} />
      <Text style={styles.underButton}>A smarter way to keep your home running.</Text>
      <FortFooter />
    </AuthShell>
  );
}

// ─── 3. LOGIN / SIGN-UP ───────────────────────────────────────────────────────
function Login({
  next, location, onLocation, onSubmit,
}: {
  next: (s: Screen) => void;
  location: string;
  onLocation: () => void;
  onSubmit: (m: string) => void;
}) {
  const [mobile, setMobile] = useState('');
  const [toast, setToast] = useState('');
  const valid = /^[6-9]\d{9}$/.test(mobile);

  const showToast = (t: string) => { setToast(t); setTimeout(() => setToast(''), 2200); };

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <View style={{ width: 44 }} />
        <LocationPill location={location} onPress={onLocation} />
      </View>

      <View style={styles.centered}><NowFixLogo /></View>
      <Text style={styles.tagline}>Trusted home services, right at your doorstep.</Text>

      {/* Category icons from screenshot */}
      <Image
        source={require('../assets/images/categories_row.png')}
        style={styles.categoriesRowImg}
        resizeMode="contain"
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Login or Sign Up</Text>
        <Text style={styles.cardSubtitle}>Enter your mobile number to continue</Text>

        <View style={[styles.inputRow, !valid && mobile.length > 0 && styles.inputError]}>
          <View style={styles.countryCode}>
            <Text style={styles.flagText}>🇮🇳</Text>
            <Text style={styles.codeText}>+91</Text>
            <ChevronDown size={13} color="#6B7280" />
          </View>
          <View style={styles.vDivider} />
          <TextInput
            placeholder="Enter mobile number"
            placeholderTextColor="#9AA5B8"
            value={mobile}
            onChangeText={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            style={styles.textInput}
          />
        </View>
        {!valid && mobile.length > 0 && (
          <Text style={styles.errorText}>Enter a valid 10-digit mobile number</Text>
        )}

        <PrimaryButton
          title="Continue"
          disabled={mobile.length > 0 && !valid}
          onPress={() => { onSubmit(mobile); next('otp'); }}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable onPress={() => showToast('Google sign-in (demo)')} style={styles.socialBtn}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </Pressable>
          <Pressable onPress={() => showToast('Apple sign-in (demo)')} style={styles.socialBtn}>
            <Text style={styles.appleA}>●</Text>
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </Pressable>
        </View>

        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>

        <Pressable onPress={() => next('forgot')} style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={[styles.linkText, { fontSize: 13 }]}>Forgot password?</Text>
        </Pressable>
      </View>

      {toast ? <Toast text={toast} /> : null}
      <FortFooter />
    </AuthShell>
  );
}

// ─── 4. OTP VERIFICATION ──────────────────────────────────────────────────────
function Otp({ next, phone, back }: { next: (s: Screen) => void; phone: string; back: () => void }) {
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const verify = () => {
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    if (otp !== '123456') { setError('Incorrect OTP. Try 123456'); return; }
    setError('');
    next(Number(phone.slice(-1)) % 2 === 0 ? 'home' : 'create');
  };

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconBtn}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
        <Text style={styles.topStepText}>Secure Verification</Text>
      </View>

      <View style={styles.otpCircle}>
        <LockKeyhole size={44} color={colors.primary} />
      </View>

      <Text style={styles.heroTitle}>Verify your mobile number</Text>
      <Text style={styles.bodyCenter}>
        We sent a 6-digit OTP to{'\n'}+91 {phone || 'XXXXX XXXXX'}{' '}
        <Text style={styles.linkText} onPress={back}>Edit</Text>
      </Text>

      <View style={styles.otpBoxRow}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TextInput
            key={i}
            maxLength={1}
            keyboardType="number-pad"
            value={otp[i] || ''}
            onChangeText={(v) => setOtp((otp.slice(0, i) + v + otp.slice(i + 1)).slice(0, 6))}
            style={[styles.otpBox, error ? styles.inputError : null]}
          />
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={[styles.bodyCenter, { marginTop: 12 }]}>
        Didn't receive it?{' '}
        <Text style={styles.linkText}>{seconds ? `Resend in ${seconds}s` : 'Resend now'}</Text>
      </Text>

      <PrimaryButton title="Verify OTP" disabled={otp.length !== 6} onPress={verify} />

      <View style={styles.badgesRow}>
        {['Secure Verification', 'Quick Access', 'Join Thousands'].map((l) => (
          <View key={l} style={styles.badgeItem}>
            <ShieldCheck size={18} color={colors.success} />
            <Text style={styles.badgeText}>{l}</Text>
          </View>
        ))}
      </View>
    </AuthShell>
  );
}

// ─── 5. CREATE ACCOUNT ────────────────────────────────────────────────────────
function Create({
  next, location, onLocation, back,
}: {
  next: (s: Screen) => void;
  location: string;
  onLocation: () => void;
  back: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const showToast = (t: string) => { setToast(t); setTimeout(() => setToast(''), 2200); };

  const handleSendOtp = () => {
    if (mobile.length !== 10) { showToast('Enter a valid 10-digit number first'); return; }
    setOtpSent(true);
    setTimer(30);
    setOtp('123456');
    showToast('OTP sent! (Demo: 123456)');
  };

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconBtn}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
        <Text style={styles.topStepText}>Step 1 of 3</Text>
      </View>

      <View style={styles.centered}><NowFixLogo /></View>
      <Text style={styles.tagline}>Create your account and get started with{'\n'}trusted home services.</Text>

      <Image source={require('../assets/images/categories_row.png')} style={styles.categoriesRowImg} resizeMode="contain" />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Your Account</Text>
        <Text style={styles.cardSubtitle}>Quick registration, almost there!</Text>

        {/* Full Name */}
        <View style={styles.inputRow}>
          <UserRound size={19} color="#9AA5B8" />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#9AA5B8"
            value={fullName}
            onChangeText={setFullName}
            style={styles.textInput}
            autoCapitalize="words"
          />
        </View>

        {/* Mobile + OTP Button */}
        <View style={styles.inputRow}>
          <View style={styles.countryCode}>
            <Text style={styles.flagText}>🇮🇳</Text>
            <Text style={styles.codeText}>+91</Text>
            <ChevronDown size={13} color="#6B7280" />
          </View>
          <View style={styles.vDivider} />
          <TextInput
            placeholder="Enter mobile number"
            placeholderTextColor="#9AA5B8"
            value={mobile}
            onChangeText={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            style={[styles.textInput, { flex: 1 }]}
          />
          <Pressable onPress={handleSendOtp} style={styles.sendOtpBtn}>
            <Text style={styles.sendOtpText}>{otpSent ? 'Resend' : 'Send OTP'}</Text>
          </Pressable>
        </View>

        {/* OTP Entry */}
        <View style={styles.inputRow}>
          <ShieldCheck size={19} color="#9AA5B8" />
          <TextInput
            placeholder="Enter OTP"
            placeholderTextColor="#9AA5B8"
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            style={[styles.textInput, { flex: 1 }]}
          />
          <Text style={styles.resendSmall}>
            {otpSent && timer > 0 ? `Resend in ${timer}s` : "Didn't receive? Resend in 30s"}
          </Text>
        </View>

        {/* Email */}
        <View style={styles.inputRow}>
          <MessageCircle size={19} color="#9AA5B8" />
          <TextInput
            placeholder="Email Address (Optional)"
            placeholderTextColor="#9AA5B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>

        {/* Location */}
        <Pressable onPress={onLocation} style={styles.inputRow}>
          <MapPin size={19} color="#9AA5B8" />
          <Text style={styles.locationValue}>{location}</Text>
          <ChevronDown size={18} color={colors.navy} />
        </Pressable>

        {/* Terms */}
        <Pressable onPress={() => setTerms(!terms)} style={styles.checkRow}>
          <View style={[styles.checkbox, terms && styles.checkboxOn]}>
            {terms && <Check size={13} color="#fff" strokeWidth={3} />}
          </View>
          <Text style={styles.checkLabel}>
            I agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </Pressable>

        <PrimaryButton title="Create Account" onPress={() => next('profile')} />

        <Pressable onPress={() => next('login')} style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.linkText}>Login</Text>
          </Text>
        </Pressable>
      </View>

      {toast ? <Toast text={toast} /> : null}
      <FortFooter />
    </AuthShell>
  );
}

// ─── 6. PROFILE SETUP (matches Image 3) ───────────────────────────────────────
function ProfileSetup({
  next, location, onLocation, back,
}: {
  next: (s: Screen) => void;
  location: string;
  onLocation: () => void;
  back: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState('');

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconBtn}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
        <Pressable onPress={() => next('home')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>

      <View style={styles.centered}><NowFixLogo /></View>
      <Text style={styles.tagline}>Just a few details to complete your profile.</Text>

      {/* Stepper */}
      <View style={styles.stepper}>
        {['Mobile\nVerified', 'Create\nAccount', 'Profile\nSetup'].map((step, i) => (
          <React.Fragment key={step}>
            <View style={styles.stepperItem}>
              <View style={i < 2 ? styles.stepDone : styles.stepActive}>
                {i < 2
                  ? <Check size={15} color="#fff" strokeWidth={3} />
                  : <Text style={styles.stepNum}>3</Text>}
              </View>
              <Text style={[styles.stepLabel, i === 2 && styles.stepLabelActive]}>{step}</Text>
            </View>
            {i < 2 && <View style={styles.stepLine} />}
          </React.Fragment>
        ))}
      </View>

      <Text style={styles.sectionBigTitle}>Complete Your Profile</Text>
      <Text style={styles.sectionSubtitle}>Help us serve you better with the right services.</Text>

      {/* Avatar */}
      <Pressable onPress={() => { setToast('Photo picker (demo)'); setTimeout(() => setToast(''), 2000); }} style={styles.avatarBox}>
        <View style={styles.avatarCircle}>
          <View style={styles.avatarInner}>
            <Camera size={32} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.avatarTitle}>Add Profile Photo</Text>
        <Text style={styles.avatarOptional}>(Optional)</Text>
      </Pressable>

      {/* Full Name */}
      <View style={styles.profileInputRow}>
        <UserRound size={19} color="#9AA5B8" />
        <View style={{ flex: 1 }}>
          <Text style={styles.floatLabel}>Full Name</Text>
          <TextInput
            placeholder="e.g. Rahul Sharma"
            placeholderTextColor="#9AA5B8"
            value={fullName}
            onChangeText={setFullName}
            style={styles.floatInput}
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.profileInputRow}>
        <MessageCircle size={19} color="#9AA5B8" />
        <View style={{ flex: 1 }}>
          <Text style={styles.floatLabel}>Email Address (Optional)</Text>
          <TextInput
            placeholder="e.g. rahul@example.com"
            placeholderTextColor="#9AA5B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.floatInput}
          />
        </View>
      </View>

      {/* Location */}
      <Pressable onPress={onLocation} style={styles.profileInputRow}>
        <MapPin size={19} color="#9AA5B8" />
        <View style={{ flex: 1 }}>
          <Text style={styles.floatLabel}>Your Location</Text>
          <Text style={styles.locationValue}>{location}</Text>
        </View>
        <ChevronDown size={18} color={colors.navy} />
      </Pressable>

      {/* Info strip */}
      <View style={styles.infoStrip}>
        <View style={styles.infoIcon}>
          <HomeIcon size={20} color={colors.primary} />
        </View>
        <Text style={styles.infoText}>
          Your location helps us show available{'\n'}services in your area.
        </Text>
      </View>

      <PrimaryButton title="Continue" onPress={() => next('home')} />
      {toast ? <Toast text={toast} /> : null}
      <FortFooter />
    </AuthShell>
  );
}

// ─── 7. FORGOT PASSWORD (matches Image 1) ─────────────────────────────────────
function Forgot({ next, back }: { next: (s: Screen) => void; back: () => void }) {
  const [mobile, setMobile] = useState('');

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconBtn}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
      </View>

      <View style={styles.centered}><NowFixLogo /></View>

      {/* Lock illustration */}
      <View style={styles.forgotIllustration}>
        <View style={styles.forgotLockBg}>
          <LockKeyhole size={60} color={colors.primary} strokeWidth={1.5} />
        </View>
        <View style={styles.forgotRefreshBadge}>
          <RotateCcw size={22} color="#fff" />
        </View>
      </View>

      <Text style={[styles.heroTitle, { marginTop: 8 }]}>Forgot Password?</Text>
      <Text style={styles.bodyCenter}>
        No worries! Enter your registered mobile number{'\n'}and we'll send you an OTP to reset your password.
      </Text>

      <View style={styles.inputRow}>
        <View style={styles.countryCode}>
          <Text style={styles.flagText}>🇮🇳</Text>
          <Text style={styles.codeText}>+91</Text>
          <ChevronDown size={13} color="#6B7280" />
        </View>
        <View style={styles.vDivider} />
        <TextInput
          placeholder="Enter your mobile number"
          placeholderTextColor="#9AA5B8"
          value={mobile}
          onChangeText={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          style={styles.textInput}
        />
      </View>

      <PrimaryButton title="Send OTP" onPress={() => next('otp')} />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.infoStrip}>
        <View style={styles.infoIcon}>
          <ShieldCheck size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.infoText, { fontFamily: typography.semibold }]}>Your account is safe with us</Text>
          <Text style={styles.infoText}>We'll only send an OTP to your registered number.</Text>
        </View>
      </View>

      <Pressable onPress={back} style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.linkText}>
          <Text>{'< '}</Text>Back to Login
        </Text>
      </Pressable>

      <FortFooter />
    </AuthShell>
  );
}

// ─── 8. LOCATION SELECTOR (matches Image 5) ───────────────────────────────────
function Location({
  location, setLocation, back,
}: {
  location: string;
  setLocation: (v: string) => void;
  back: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = popularCities.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  const cityEmojis: Record<string, string> = {
    Jaipur: '🏰', Jodhpur: '🏯', Udaipur: '🏛️', Kota: '🕌',
    Delhi: '🕍', Mumbai: '🌆', Bengaluru: '🏙️', Ahmedabad: '🏟️',
  };
  const cityColors = ['#EC4899', '#3B82F6', '#8B5CF6', '#F59E0B', '#6B7280', '#10B981', '#059669', '#EF4444'];

  const allLocations = recentLocations;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable onPress={back} style={styles.iconBtn}>
            <ArrowLeft size={24} color={colors.navy} />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.locationScreenTitle}>Select Location</Text>
            <Text style={styles.locationScreenSub}>Find services near you</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={18} color="#9AA5B8" />
          <TextInput
            placeholder="Search city, area or pincode..."
            placeholderTextColor="#9AA5B8"
            value={query}
            onChangeText={setQuery}
            style={[styles.textInput, { fontSize: 13 }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <X size={16} color="#9AA5B8" />
            </Pressable>
          )}
        </View>

        {/* Mock Map */}
        <View style={styles.mapBox}>
          <View style={styles.mapBackground} />
          {/* Overlay map pins */}
          <View style={[styles.mapPin, { top: 30, left: 30 }]}>
            <Text style={styles.mapPinEmoji}>🏠</Text>
          </View>
          <View style={[styles.mapPin, { top: 50, right: 60 }]}>
            <Text style={styles.mapPinEmoji}>🔧</Text>
          </View>
          <View style={[styles.mapPin, { bottom: 20, left: 100 }]}>
            <Text style={styles.mapPinEmoji}>🛒</Text>
          </View>
          <View style={[styles.mapPin, { bottom: 30, right: 30 }]}>
            <Text style={styles.mapPinEmoji}>➕</Text>
          </View>
          {/* Current location bubble */}
          <View style={styles.currentLocBubble}>
            <Navigation size={14} color={colors.primary} />
            <View>
              <Text style={styles.currentLocTitle}>Current Location</Text>
              <Text style={styles.currentLocSub}>{location}</Text>
            </View>
          </View>
          {/* GPS target */}
          <Pressable style={styles.gpsBtn}>
            <Target size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Use Current Location row */}
        <Pressable
          onPress={() => { setLocation('Bikaner, Rajasthan'); back(); }}
          style={styles.useCurrentRow}
        >
          <View style={styles.useCurrentIcon}>
            <Target size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.useCurrentTitle}>Use Current Location</Text>
            <Text style={styles.useCurrentSub}>Detect my current location</Text>
          </View>
          <ChevronRight size={18} color="#9AA5B8" />
        </Pressable>

        {/* Recent Locations */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionBold}>Recent Locations</Text>
          <Pressable><Text style={styles.linkText}>Clear All</Text></Pressable>
        </View>

        {allLocations.map((loc) => (
          <Pressable
            key={loc}
            onPress={() => { setLocation(loc); back(); }}
            style={styles.recentLocRow}
          >
            <MapPin size={17} color="#9AA5B8" />
            <Text style={styles.recentLocText}>{loc}</Text>
            {location === loc
              ? <Check size={18} color={colors.primary} />
              : <ChevronRight size={18} color="#9AA5B8" />}
          </Pressable>
        ))}

        {/* Popular Cities */}
        <Text style={[styles.sectionBold, { marginTop: 20, marginBottom: 12 }]}>Popular Cities</Text>
        <View style={styles.cityGrid}>
          {filtered.map((city, i) => (
            <Pressable
              key={city}
              onPress={() => { setLocation(`${city}, Rajasthan`); back(); }}
              style={styles.cityCard}
            >
              <Text style={[styles.cityEmoji, { color: cityColors[i % cityColors.length] }]}>
                {cityEmojis[city] || '🏙️'}
              </Text>
              <Text style={styles.cityName}>{city}</Text>
            </Pressable>
          ))}
        </View>

        <PrimaryButton title="Confirm Location" onPress={back} />
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 9. HOME SCREEN (matches Image 2) ─────────────────────────────────────────
function Home({
  location, onLocation, openCategories, tab,
}: {
  location: string;
  onLocation: () => void;
  openCategories: () => void;
  tab: (s: Screen) => void;
}) {
  const popularServiceCards = [
    { label: 'Electrician', icon: Zap, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Plumber', icon: Droplets, color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Appliance Repair', icon: Refrigerator, color: '#06B6D4', bg: '#ECFEFF' },
    { label: 'Cleaning', icon: Sparkles, color: '#F59E0B', bg: '#FEF9C3' },
    { label: 'Carpenter', icon: Hammer, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Paint &\nWaterproofing', icon: Paintbrush, color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 }]} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={[styles.topBar, { alignItems: 'flex-start' }]}>
          <LocationPill location={location} onPress={onLocation} />
          <Bell size={22} color={colors.navy} />
        </View>

        <Text style={styles.greetingLight}>Good Morning,</Text>
        <Text style={styles.greetingBold}>NowFix User 👋</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={18} color="#9AA5B8" />
          <TextInput
            placeholder="Search for a service..."
            placeholderTextColor="#9AA5B8"
            style={styles.textInput}
          />
        </View>

        {/* Banner */}
        <View style={styles.homeBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Home Repairs{'\n'}Made Easy</Text>
            <Text style={styles.bannerSub}>Trusted professionals{'\n'}at your doorstep</Text>
            <Pressable onPress={openCategories} style={styles.bannerBookBtn}>
              <Text style={styles.bannerBookText}>Book Now</Text>
            </Pressable>
          </View>
          <View style={styles.bannerIconCircle}>
            <Wrench size={36} color="#3B82F6" />
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionBold}>Popular Services</Text>
          <Pressable onPress={openCategories}>
            <Text style={styles.linkText}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.homeServicesGrid}>
          {popularServiceCards.map(({ label, icon: Icon, color, bg }) => (
            <Pressable key={label} onPress={openCategories} style={styles.homeServiceCard}>
              <View style={[styles.homeServiceIcon, { backgroundColor: bg }]}>
                <Icon size={26} color={color} strokeWidth={1.8} />
              </View>
              <Text style={styles.homeServiceLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Trust badges */}
        <View style={styles.trustRow}>
          {[
            { icon: Check, color: '#10B981', bg: '#D1FAE5', label: 'Verified Experts', sub: 'Background-checked\nprofessionals' },
            { icon: Star, color: '#F59E0B', bg: '#FEF3C7', label: 'Transparent Pricing', sub: 'No hidden charges' },
            { icon: Zap, color: '#EF4444', bg: '#FEE2E2', label: 'Fast Response', sub: 'Service within the\nhour' },
          ].map(({ icon: Icon, color, bg, label, sub }) => (
            <View key={label} style={styles.trustCard}>
              <View style={[styles.trustIcon, { backgroundColor: bg }]}>
                <Icon size={20} color={color} />
              </View>
              <Text style={styles.trustLabel}>{label}</Text>
              <Text style={styles.trustSub}>{sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomTabs active="home" tab={tab} />
    </SafeAreaView>
  );
}

// ─── 10. CATEGORIES SCREEN (matches Image 4) ──────────────────────────────────
function Categories({
  location, onLocation, back, tab,
}: {
  location: string;
  onLocation: () => void;
  back: () => void;
  tab: (s: Screen) => void;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.catHeader}>
          <Pressable onPress={back} style={styles.iconBtn}>
            <ArrowLeft size={22} color={colors.navy} />
          </Pressable>
          <Image source={require('../assets/images/logo_light.png')} style={styles.logoCompact} resizeMode="contain" />
          <LocationPill location={location} onPress={onLocation} />
          <Pressable style={styles.bellBtn}>
            <Bell size={20} color={colors.navy} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <Text style={styles.catScreenTitle}>Service Categories</Text>
        <Text style={styles.catScreenSub}>What can we help you with?</Text>

        <View style={styles.searchBar}>
          <Search size={18} color="#9AA5B8" />
          <TextInput placeholder="Search services..." placeholderTextColor="#9AA5B8" style={styles.textInput} />
        </View>

        {/* 3-column grid */}
        <View style={styles.catGrid}>
          {categories.map(([name, sub, icon]) => {
            const iconKey = icon as IconName;
            const Icon = categoryIconMap[iconKey] || CircleEllipsis;
            const ic = categoryColorMap[iconKey] || '#6B7280';
            const bg = categoryBgMap[iconKey] || '#F3F4F6';
            return (
              <Pressable key={name} style={styles.catCard}>
                <View style={[styles.catIconBox, { backgroundColor: bg }]}>
                  <Icon size={28} color={ic} strokeWidth={1.8} />
                </View>
                <Text style={styles.catCardName}>{name}</Text>
                <Text style={styles.catCardSub}>{sub}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Popular Services */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionBold}>Popular Services</Text>
          <Pressable><Text style={styles.linkText}>See All &gt;</Text></Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
          {popularServices.map((s) => (
            <View key={s.name} style={styles.popularCard}>
              <View style={styles.popularCardImgBox}>
                <Wrench size={34} color={colors.primary} />
              </View>
              <Text style={styles.popularCardName}>{s.name}</Text>
              <View style={styles.popularCardMeta}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.popularCardRating}>{s.rating} ({s.reviews})</Text>
              </View>
              <Text style={styles.popularCardPrice}>From ₹{s.price}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <BottomTabs active="categories" tab={tab} />
    </SafeAreaView>
  );
}

// ─── PLACEHOLDER TABS ──────────────────────────────────────────────────────────
function Placeholder({ title, icon, tab }: { title: string; icon: React.ReactNode; tab: (s: Screen) => void }) {
  return (
    <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
      <View style={styles.placeholderIconBox}>{icon}</View>
      <Text style={styles.sectionBigTitle}>{title}</Text>
      <Text style={styles.bodyCenter}>Coming soon</Text>
      <BottomTabs active={title.toLowerCase()} tab={tab} />
    </SafeAreaView>
  );
}

// ─── BOTTOM TABS ───────────────────────────────────────────────────────────────
function BottomTabs({ active, tab }: { active: string; tab: (s: Screen) => void }) {
  const tabs = [
    { key: 'home', label: 'Home', Icon: HomeIcon },
    { key: 'categories', label: 'Categories', Icon: Sparkles },
    { key: 'bookings', label: 'Bookings', Icon: CalendarDays },
    { key: 'messages', label: 'Messages', Icon: HelpCircle },
    { key: 'profile', label: 'Profile', Icon: UserRound },
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <Pressable
            key={key}
            onPress={() => tab(key === 'home' ? 'home' : key === 'categories' ? 'categories' : key === 'bookings' ? 'bookings' : key === 'messages' ? 'messages' : 'profileTab')}
            style={styles.tabItem}
          >
            <Icon size={22} color={isActive ? colors.primary : '#9AA5B8'} strokeWidth={isActive ? 2.2 : 1.8} />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── ROOT COMPONENT ────────────────────────────────────────────────────────────
export default function Index() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [screen, setScreen] = useState<Screen>('splash');
  const [location, setLocation] = useState('Bikaner, Rajasthan');
  const [locationReturn, setLocationReturn] = useState<Screen>('login');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Always clear session so the full flow runs every time:
    // Splash → Onboarding → Login → Home
    AsyncStorage.multiRemove(['nowfix_onboarding', 'nowfix_logged_in']);
  }, []);

  const go = (next: Screen) => {
    setScreen(next);
  };

  const goLocation = (returnScreen: Screen) => {
    setLocationReturn(returnScreen);
    setScreen('location');
  };

  const screenView = useMemo(() => {
    if (!fontsLoaded) return null;
    switch (screen) {
      case 'splash': return <Splash next={() => go('onboarding')} />;
      case 'onboarding': return <Onboarding next={go} />;
      case 'login': return <Login next={go} onSubmit={setPhone} location={location} onLocation={() => goLocation('login')} />;
      case 'otp': return <Otp next={go} phone={phone} back={() => go('login')} />;
      case 'create': return <Create next={go} location={location} onLocation={() => goLocation('create')} back={() => go('login')} />;
      case 'profile': return <ProfileSetup next={go} location={location} onLocation={() => goLocation('profile')} back={() => go('create')} />;
      case 'forgot': return <Forgot next={go} back={() => go('login')} />;
      case 'location': return <Location location={location} setLocation={setLocation} back={() => go(locationReturn)} />;
      case 'home': return <Home location={location} onLocation={() => goLocation('home')} openCategories={() => go('categories')} tab={go} />;
      case 'categories': return <Categories location={location} onLocation={() => goLocation('categories')} back={() => go('home')} tab={go} />;
      case 'bookings': return <Placeholder title="Bookings" icon={<CalendarDays size={32} color={colors.primary} />} tab={go} />;
      case 'messages': return <Placeholder title="Messages" icon={<MessageCircle size={32} color={colors.primary} />} tab={go} />;
      default: return <Placeholder title="Profile" icon={<UserRound size={32} color={colors.primary} />} tab={go} />;
    }
  }, [fontsLoaded, screen, location, phone, locationReturn]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {screenView}
    </KeyboardAvoidingView>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────────
const CARD_SHADOW = {
  shadowColor: '#0F1B3D',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F9FF' },
  safe: { flex: 1, backgroundColor: '#F5F9FF' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

  // Top bars
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    ...CARD_SHADOW,
  },
  skipText: {
    fontFamily: typography.semibold,
    color: colors.primary,
    fontSize: 14,
  },
  topStepText: {
    fontFamily: typography.semibold,
    color: colors.primary,
    fontSize: 14,
  },

  // Logos
  logoFull: { width: 200, height: 140 },
  logoCompact: { width: 90, height: 34 },
  centered: { alignItems: 'center', marginVertical: 8 },

  // Text
  heroTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    lineHeight: 30,
    color: colors.navy,
    textAlign: 'center',
    marginTop: 8,
  },
  bodyCenter: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
  },
  tagline: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
    lineHeight: 19,
  },
  linkText: {
    fontFamily: typography.semibold,
    color: colors.primary,
    fontSize: 13,
  },
  switchText: {
    fontFamily: typography.regular,
    color: colors.navy,
    fontSize: 13,
  },

  // Onboarding
  onboardHeroBox: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  onboardHeroImg: { width: '100%', height: 270 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 12 },
  dotActive: { width: 22, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  dotIdle: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#CBD5E1' },
  underButton: {
    textAlign: 'center',
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 12,
    marginTop: 10,
  },

  // Fort
  fortContainer: { width: '100%', marginTop: 16 },
  fortImage: { width: '100%', height: 100 },

  // Categories row image
  categoriesRowImg: { width: '100%', height: 78, marginVertical: 8 },

  // Primary button
  primaryButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonDisabled: { backgroundColor: '#93C5FD', elevation: 0 },
  primaryButtonText: { color: '#fff', fontFamily: typography.semibold, fontSize: 16 },

  // Location pill
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EEF5FE',
    borderRadius: 999,
    maxWidth: 180,
  },
  locationPillText: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.primary,
    flex: 1,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    ...CARD_SHADOW,
  },
  cardTitle: { fontFamily: typography.bold, fontSize: 22, color: colors.navy },
  cardSubtitle: { fontFamily: typography.regular, fontSize: 13, color: '#6B7280', marginTop: 3, marginBottom: 10 },

  // Inputs
  inputRow: {
    height: 52,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 8,
  },
  inputError: { borderColor: colors.danger },
  textInput: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.navy,
    paddingVertical: 0,
    minHeight: 46,
  },
  errorText: { fontFamily: typography.regular, color: colors.danger, fontSize: 12, marginTop: 4 },
  locationValue: { flex: 1, fontFamily: typography.medium, fontSize: 13, color: colors.navy },

  // Country code
  countryCode: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 4 },
  flagText: { fontSize: 16 },
  codeText: { fontFamily: typography.medium, fontSize: 13, color: colors.navy },
  vDivider: { width: 1, height: 22, backgroundColor: '#DFE7F3', marginRight: 4 },

  // Send OTP
  sendOtpBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sendOtpText: { color: '#fff', fontFamily: typography.semibold, fontSize: 12 },
  resendSmall: { fontFamily: typography.medium, color: colors.primary, fontSize: 10, maxWidth: 90 },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5ECF5' },
  dividerText: { fontFamily: typography.regular, color: '#9AA5B8', fontSize: 12 },

  // Social
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  socialBtnText: { fontFamily: typography.medium, fontSize: 11, color: colors.navy },
  googleG: { fontFamily: typography.bold, fontSize: 18, color: '#4285F4' },
  appleA: { fontSize: 16, color: '#111111' },
  termsText: {
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 17,
  },

  // Checkbox
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkLabel: { flex: 1, fontFamily: typography.regular, fontSize: 11, color: colors.navy },

  // OTP Screen
  otpCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF5FE',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  otpBoxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  otpBox: {
    width: 46,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#DFE7F3',
    borderRadius: 12,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontFamily: typography.semibold,
    fontSize: 22,
    color: colors.navy,
  },
  badgesRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  badgeItem: { alignItems: 'center', gap: 4 },
  badgeText: { fontFamily: typography.regular, color: '#6B7280', fontSize: 10, textAlign: 'center' },

  // Profile Setup
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  stepperItem: { alignItems: 'center', width: 70 },
  stepLine: { flex: 1, height: 2, backgroundColor: '#5A9BE8', marginBottom: 22 },
  stepDone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5A9BE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { color: '#fff', fontFamily: typography.bold, fontSize: 14 },
  stepLabel: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 13,
  },
  stepLabelActive: { color: colors.primary, fontFamily: typography.semibold },
  sectionBigTitle: { fontFamily: typography.bold, fontSize: 22, color: colors.navy, marginTop: 10 },
  sectionSubtitle: { fontFamily: typography.regular, fontSize: 13, color: '#6B7280', marginTop: 2 },
  avatarBox: { alignItems: 'center', marginVertical: 16 },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.8,
    borderColor: '#7EAFEB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FF',
  },
  avatarInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#E4EFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTitle: { fontFamily: typography.semibold, color: colors.primary, fontSize: 13, marginTop: 8 },
  avatarOptional: { fontFamily: typography.regular, color: '#6B7280', fontSize: 11 },
  profileInputRow: {
    height: 62,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 10,
  },
  floatLabel: { fontFamily: typography.medium, fontSize: 10, color: '#6B7280', marginBottom: 1 },
  floatInput: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.navy,
    paddingVertical: 0,
  },
  infoStrip: {
    backgroundColor: '#EEF5FE',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { fontFamily: typography.regular, color: '#556885', fontSize: 12, lineHeight: 18, flex: 1 },

  // Forgot
  forgotIllustration: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotLockBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EEF5FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotRefreshBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // Location Screen
  locationScreenTitle: { fontFamily: typography.bold, fontSize: 18, color: colors.navy },
  locationScreenSub: { fontFamily: typography.regular, fontSize: 12, color: '#6B7280', marginTop: 1 },
  searchBar: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginTop: 10,
    ...CARD_SHADOW,
  },
  mapBox: {
    height: 170,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    overflow: 'hidden',
    marginTop: 14,
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E5F3E8',
  },
  mapPin: { position: 'absolute' },
  mapPinEmoji: { fontSize: 22 },
  currentLocBubble: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...CARD_SHADOW,
  },
  currentLocTitle: { fontFamily: typography.semibold, fontSize: 11, color: colors.navy },
  currentLocSub: { fontFamily: typography.regular, fontSize: 10, color: '#6B7280' },
  gpsBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  useCurrentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    ...CARD_SHADOW,
  },
  useCurrentIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF5FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  useCurrentTitle: { fontFamily: typography.semibold, fontSize: 14, color: colors.navy },
  useCurrentSub: { fontFamily: typography.regular, fontSize: 11, color: '#6B7280', marginTop: 1 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  sectionBold: { fontFamily: typography.bold, fontSize: 16, color: colors.navy },
  recentLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0F4FA',
  },
  recentLocText: { flex: 1, fontFamily: typography.medium, fontSize: 14, color: colors.navy },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  cityCard: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    ...CARD_SHADOW,
  },
  cityEmoji: { fontSize: 26 },
  cityName: { fontFamily: typography.medium, fontSize: 10, color: colors.navy, textAlign: 'center' },

  // Home Screen
  greetingLight: { fontFamily: typography.regular, fontSize: 14, color: '#6B7280', marginTop: 12 },
  greetingBold: { fontFamily: typography.bold, fontSize: 20, color: colors.navy, marginBottom: 8 },
  homeBanner: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerTitle: { fontFamily: typography.bold, fontSize: 18, color: '#FFFFFF', lineHeight: 24 },
  bannerSub: { fontFamily: typography.regular, fontSize: 11, color: '#CBE3FF', marginTop: 4, lineHeight: 16 },
  bannerBookBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bannerBookText: { fontFamily: typography.bold, fontSize: 13, color: '#FFFFFF' },
  bannerIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  homeServiceCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    ...CARD_SHADOW,
  },
  homeServiceIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  homeServiceLabel: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.navy,
    textAlign: 'center',
    lineHeight: 15,
  },
  trustRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 8 },
  trustCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F4FA',
    ...CARD_SHADOW,
  },
  trustIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  trustLabel: { fontFamily: typography.semibold, fontSize: 11, color: colors.navy, textAlign: 'center' },
  trustSub: { fontFamily: typography.regular, fontSize: 9, color: '#6B7280', textAlign: 'center', marginTop: 2, lineHeight: 13 },

  // Categories Screen
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  catScreenTitle: { fontFamily: typography.bold, fontSize: 24, color: colors.navy, marginTop: 10 },
  catScreenSub: { fontFamily: typography.regular, fontSize: 13, color: '#6B7280', marginTop: 2 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 },
  catCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    ...CARD_SHADOW,
  },
  catIconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catCardName: { fontFamily: typography.semibold, fontSize: 11, color: colors.navy, textAlign: 'center' },
  catCardSub: { fontFamily: typography.regular, fontSize: 9, color: '#6B7280', textAlign: 'center', marginTop: 2, lineHeight: 13 },
  bellBtn: { position: 'relative', padding: 4 },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#F5F9FF',
  },
  popularCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    ...CARD_SHADOW,
  },
  popularCardImgBox: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    backgroundColor: '#EEF5FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  popularCardName: { fontFamily: typography.semibold, fontSize: 12, color: colors.navy },
  popularCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  popularCardRating: { fontFamily: typography.regular, fontSize: 10, color: '#6B7280' },
  popularCardPrice: { fontFamily: typography.semibold, fontSize: 12, color: colors.primary, marginTop: 3 },

  // Bottom Tabs
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#DFE7F3',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
  },
  tabItem: { alignItems: 'center', gap: 3, minWidth: 54 },
  tabLabel: { fontFamily: typography.medium, fontSize: 10, color: '#9AA5B8' },
  tabLabelActive: { color: colors.primary },

  // Placeholder
  placeholderIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF5FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 30,
    right: 30,
    borderRadius: 12,
    backgroundColor: colors.navy,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 6,
  },
  toastText: { color: '#fff', fontFamily: typography.medium, fontSize: 13 },
});
