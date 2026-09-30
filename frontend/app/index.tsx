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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Home as HomeIcon,
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
} from 'lucide-react-native';
import { categories, popularCities, recentServices } from '@/src/data/mock';
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

function Toast({ text }: { text: string }) {
  return (
    <View style={styles.toast}>
      <Check size={16} color={colors.surface} />
      <Text style={styles.toastText}>{text}</Text>
    </View>
  );
}

function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
      <ArrowRight size={20} color={colors.surface} />
    </Pressable>
  );
}

function LocationPill({
  location,
  onPress,
}: {
  location: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.locationPill}>
      <MapPin size={15} color={colors.primary} />
      <Text style={styles.locationText}>{location}</Text>
      <ChevronDown size={14} color={colors.primary} />
    </Pressable>
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

function CategoryRow() {
  return (
    <View style={styles.categoryRowWrapper}>
      <Image
        source={require('../assets/images/categories_row.png')}
        style={styles.categoryRowImg}
        resizeMode="contain"
      />
    </View>
  );
}

function Header({
  onLocation,
  onBack,
  title,
}: {
  onLocation?: () => void;
  onBack?: () => void;
  title?: string;
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.iconButton}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
      ) : (
        <Image
          source={require('../assets/images/logo_light.png')}
          style={styles.headerLogoCompact}
          resizeMode="contain"
        />
      )}
      {title && <Text style={styles.headerTitle}>{title}</Text>}
      {onLocation ? (
        <LocationPill location="Bikaner, Rajasthan" onPress={onLocation} />
      ) : (
        <Bell size={22} color={colors.navy} />
      )}
    </View>
  );
}

function AuthShell({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
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

// 1. SPLASH SCREEN: Exact same visual as Image 1 (media_1790794717730.jpg)
function Splash({ next }: { next: () => void }) {
  useEffect(() => {
    const timer = setTimeout(next, 2200);
    return () => clearTimeout(timer);
  }, [next]);

  return (
    <Pressable onPress={next} style={styles.splashScreen}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/splash_screen.png')}
        style={styles.splashFullImage}
        resizeMode="cover"
      />
    </Pressable>
  );
}

// 2. ONBOARDING SCREEN: Exact same visual as Image 5 (media_1790794717760.jpg)
function Onboarding({ next }: { next: (s: Screen) => void }) {
  return (
    <AuthShell>
      <View style={styles.topBar}>
        <View style={{ width: 44 }} />
        <Pressable onPress={() => next('login')}>
          <Text style={styles.topActionText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.logoCentered}>
        <Image
          source={require('../assets/images/logo_light.png')}
          style={styles.logoLight}
          resizeMode="contain"
        />
      </View>

      <View style={styles.onboardTextContainer}>
        <Text style={styles.heroTitle}>
          Reliable Home Services{'\n'}Now Just a Tap Away
        </Text>
        <Text style={styles.bodyTextCenter}>
          Book verified professionals for electrical, plumbing, appliance repair, cleaning and more in your city.
        </Text>
      </View>

      <View style={styles.onboardHeroContainer}>
        <Image
          source={require('../assets/images/onboard_hero.png')}
          style={styles.onboardHeroImg}
          resizeMode="contain"
        />
      </View>

      <View style={styles.dotsRow}>
        <View style={styles.dotActivePill} />
        <View style={styles.dotInactive} />
        <View style={styles.dotInactive} />
      </View>

      <PrimaryButton title="Get Started" onPress={() => next('login')} />

      <Text style={styles.underButton}>
        A smarter way to keep your home running.
      </Text>

      <FortFooter />
    </AuthShell>
  );
}

// 3. LOGIN / SIGN UP: Exact same visual as Image 4 (media_1790794717755.jpg)
function Login({
  next,
  location,
  onLocation,
  onSubmit,
}: {
  next: (s: Screen) => void;
  location: string;
  onLocation: () => void;
  onSubmit: (mobile: string) => void;
}) {
  const [mobile, setMobile] = useState('');
  const [toast, setToast] = useState('');
  const valid = /^[6-9]\d{9}$/.test(mobile);

  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(''), 2000);
  };

  const handleContinue = () => {
    if (valid) {
      onSubmit(mobile);
      next('otp');
    } else {
      next('create');
    }
  };

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <View style={{ width: 44 }} />
        <LocationPill location={location} onPress={onLocation} />
      </View>

      <View style={styles.logoCentered}>
        <Image
          source={require('../assets/images/logo_light.png')}
          style={styles.logoLight}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.tagline}>
        Trusted home services, right at your doorstep.
      </Text>

      <CategoryRow />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Login or Sign Up</Text>
        <Text style={styles.cardSubtitle}>
          Enter your mobile number to continue
        </Text>

        <View style={[styles.fieldRow, !valid && mobile.length > 0 && styles.errorField]}>
          <View style={styles.countryPicker}>
            <Text style={styles.flagEmoji}>🇮🇳</Text>
            <Text style={styles.countryText}>+91</Text>
            <ChevronDown size={14} color="#6B7280" />
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
          onPress={handleContinue}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable onPress={() => showToast('Google sign in demo')} style={styles.socialBtn}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </Pressable>
          <Pressable onPress={() => showToast('Apple sign in demo')} style={styles.socialBtn}>
            <Text style={styles.appleIcon}>●</Text>
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </Pressable>
        </View>

        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>

        <Pressable onPress={() => next('create')} style={styles.switchAuth}>
          <Text style={styles.switchAuthText}>
            New here? <Text style={styles.linkTextBold}>Create Account</Text>
          </Text>
        </Pressable>
      </View>

      {toast ? <Toast text={toast} /> : null}
      <FortFooter />
    </AuthShell>
  );
}

// 4. CREATE YOUR ACCOUNT: Exact same visual as Image 2 (media_1790794717739.jpg)
// Fully editable credentials!
function Create({
  next,
  location,
  onLocation,
  back,
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
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpSent && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timerSeconds]);

  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(''), 2200);
  };

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      showToast('Enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setTimerSeconds(30);
    setOtp('123456');
    showToast('OTP sent: 123456');
  };

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconButton}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
        <Text style={styles.topStepIndicator}>Step 1 of 3</Text>
      </View>

      <View style={styles.logoCentered}>
        <Image
          source={require('../assets/images/logo_light.png')}
          style={styles.logoLight}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.tagline}>
        Create your account and get started with{'\n'}trusted home services.
      </Text>

      <CategoryRow />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Your Account</Text>
        <Text style={styles.cardSubtitle}>Quick registration, almost there!</Text>

        {/* 1. Full Name - fully editable */}
        <View style={styles.fieldRow}>
          <UserRound size={20} color="#9AA5B8" style={styles.fieldIcon} />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#9AA5B8"
            value={fullName}
            onChangeText={setFullName}
            style={styles.textInput}
            autoCapitalize="words"
          />
        </View>

        {/* 2. Mobile Number with Send OTP button - fully editable */}
        <View style={styles.fieldRow}>
          <View style={styles.countryPicker}>
            <Text style={styles.flagEmoji}>🇮🇳</Text>
            <Text style={styles.countryText}>+91</Text>
            <ChevronDown size={14} color="#6B7280" />
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
          <Pressable
            onPress={handleSendOtp}
            style={[styles.sendOtpBtn, otpSent && styles.sendOtpBtnActive]}
          >
            <Text style={styles.sendOtpBtnText}>
              {otpSent ? 'Resend' : 'Send OTP'}
            </Text>
          </Pressable>
        </View>

        {/* 3. Enter OTP - fully editable */}
        <View style={styles.fieldRow}>
          <ShieldCheck size={20} color="#9AA5B8" style={styles.fieldIcon} />
          <TextInput
            placeholder="Enter OTP"
            placeholderTextColor="#9AA5B8"
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            style={[styles.textInput, { flex: 1 }]}
          />
          <Pressable
            onPress={handleSendOtp}
            disabled={timerSeconds > 0 && otpSent}
          >
            <Text style={styles.resendInlineText}>
              {otpSent && timerSeconds > 0
                ? `Resend in ${timerSeconds}s`
                : "Didn't receive? Resend in 30s"}
            </Text>
          </Pressable>
        </View>

        {/* 4. Email Address - fully editable */}
        <View style={styles.fieldRow}>
          <MessageCircle size={20} color="#9AA5B8" style={styles.fieldIcon} />
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

        {/* 5. Location - clickable */}
        <Pressable onPress={onLocation} style={styles.fieldRow}>
          <MapPin size={20} color="#9AA5B8" style={styles.fieldIcon} />
          <Text style={styles.locationFieldValue}>
            {location || 'Bikaner, Rajasthan'}
          </Text>
          <ChevronDown size={18} color="#102142" />
        </Pressable>

        {/* Terms Checkbox */}
        <Pressable onPress={() => setTerms(!terms)} style={styles.checkboxRow}>
          <View style={[styles.checkboxSquare, terms && styles.checkboxSquareChecked]}>
            {terms && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </Pressable>

        {/* Create Account Button */}
        <PrimaryButton
          title="Create Account"
          onPress={() => next('profile')}
        />

        <Pressable onPress={() => next('login')} style={styles.switchAuth}>
          <Text style={styles.switchAuthText}>
            Already have an account? <Text style={styles.linkTextBold}>Login</Text>
          </Text>
        </Pressable>
      </View>

      {toast ? <Toast text={toast} /> : null}
      <FortFooter />
    </AuthShell>
  );
}

// 5. COMPLETE YOUR PROFILE: Exact same visual as Image 3 (media_1790794717732.jpg)
// Fully editable credentials!
function ProfileSetup({
  next,
  location,
  onLocation,
  back,
}: {
  next: (s: Screen) => void;
  location: string;
  onLocation: () => void;
  back: () => void;
}) {
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul@example.com');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconButton}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
        <Pressable onPress={() => next('home')}>
          <Text style={styles.topActionText}>Skip for now</Text>
        </Pressable>
      </View>

      <View style={styles.logoCentered}>
        <Image
          source={require('../assets/images/logo_light.png')}
          style={styles.logoLight}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.tagline}>
        Just a few details to complete your profile.
      </Text>

      {/* Stepper matching Image 3 */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperItem}>
          <View style={styles.stepCircleDone}>
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={styles.stepLabelText}>Mobile{'\n'}Verified</Text>
        </View>

        <View style={styles.stepperLine} />

        <View style={styles.stepperItem}>
          <View style={styles.stepCircleDone}>
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={styles.stepLabelText}>Create{'\n'}Account</Text>
        </View>

        <View style={styles.stepperLine} />

        <View style={styles.stepperItem}>
          <View style={styles.stepCircleActive}>
            <Text style={styles.stepActiveNumber}>3</Text>
          </View>
          <Text style={[styles.stepLabelText, styles.stepLabelActive]}>
            Profile{'\n'}Setup
          </Text>
        </View>
      </View>

      <Text style={styles.profileHeading}>Complete Your Profile</Text>
      <Text style={styles.profileSubheading}>
        Help us serve you better with the right services.
      </Text>

      {/* Profile Photo Uploader */}
      <Pressable
        onPress={() => {
          setPhotoAdded(!photoAdded);
          showToast(photoAdded ? 'Photo removed' : 'Photo selected!');
        }}
        style={styles.avatarUploader}
      >
        <View style={styles.avatarCircleDashed}>
          <View style={styles.avatarInnerBlue}>
            <Camera size={34} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.avatarTitleText}>Add Profile Photo</Text>
        <Text style={styles.avatarOptionalText}>(Optional)</Text>
      </Pressable>

      {/* Full Name Input - fully editable */}
      <View style={styles.profileInputWrapper}>
        <View style={styles.fieldRow}>
          <UserRound size={20} color="#9AA5B8" style={styles.fieldIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.floatingLabel}>Full Name</Text>
            <TextInput
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#9AA5B8"
              value={fullName}
              onChangeText={setFullName}
              style={styles.textInputWithLabel}
            />
          </View>
        </View>

        {/* Email Input - fully editable */}
        <View style={styles.fieldRow}>
          <MessageCircle size={20} color="#9AA5B8" style={styles.fieldIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.floatingLabel}>Email Address (Optional)</Text>
            <TextInput
              placeholder="e.g. rahul@example.com"
              placeholderTextColor="#9AA5B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInputWithLabel}
            />
          </View>
        </View>

        {/* Location Picker */}
        <Pressable onPress={onLocation} style={styles.fieldRow}>
          <MapPin size={20} color="#9AA5B8" style={styles.fieldIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.floatingLabel}>Your Location</Text>
            <Text style={styles.locationFieldValue}>
              {location || 'Bikaner, Rajasthan'}
            </Text>
          </View>
          <ChevronDown size={18} color="#102142" />
        </Pressable>

        {/* Info callout */}
        <View style={styles.infoCallout}>
          <View style={styles.infoHomeCircle}>
            <HomeIcon size={20} color={colors.primary} />
          </View>
          <Text style={styles.infoCalloutText}>
            Your location helps us show available{'\n'}services in your area.
          </Text>
        </View>
      </View>

      <PrimaryButton title="Continue" onPress={() => next('home')} />

      {toast ? <Toast text={toast} /> : null}
      <FortFooter />
    </AuthShell>
  );
}

// 6. OTP VERIFICATION SCREEN
function Otp({
  next,
  phone,
  back,
}: {
  next: (s: Screen) => void;
  phone: string;
  back: () => void;
}) {
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const verify = () => {
    if (otp !== '123456' && otp.length !== 6) {
      setError('Please enter the 6-digit OTP (Mock: 123456)');
      return;
    }
    next(Number(phone.slice(-1)) % 2 === 0 ? 'home' : 'create');
  };

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconButton}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
        <Text style={styles.topStepIndicator}>Secure Verification</Text>
      </View>

      <View style={styles.otpBubbleCircle}>
        <LockKeyhole size={42} color={colors.primary} />
      </View>

      <Text style={styles.heroTitle}>Verify your mobile number</Text>
      <Text style={styles.bodyTextCenter}>
        We have sent a 6-digit OTP to{'\n'}+91 {phone || 'XXXXX XXXXX'}{' '}
        <Text style={styles.linkText} onPress={back}>Edit</Text>
      </Text>

      <View style={styles.otpBoxesRow}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TextInput
            key={i}
            maxLength={1}
            keyboardType="number-pad"
            value={otp[i] || ''}
            onChangeText={(v) => {
              const updated = (otp.slice(0, i) + v + otp.slice(i + 1)).slice(0, 6);
              setOtp(updated);
            }}
            style={[styles.otpBoxSingle, error && styles.errorField]}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.resendCenterText}>
        Didn't receive it?{' '}
        <Text
          style={styles.linkText}
          onPress={() => {
            setSeconds(30);
            setOtp('123456');
          }}
        >
          {seconds ? `Resend in ${seconds}s` : 'Resend now'}
        </Text>
      </Text>

      <PrimaryButton
        title="Verify OTP"
        disabled={otp.length !== 6}
        onPress={verify}
      />

      <View style={styles.securityBadgesRow}>
        {['Secure Verification', 'Quick Access', 'Join Thousands'].map((label) => (
          <View key={label} style={styles.securityBadgeItem}>
            <ShieldCheck size={18} color={colors.success} />
            <Text style={styles.securityBadgeText}>{label}</Text>
          </View>
        ))}
      </View>
    </AuthShell>
  );
}

// 7. LOCATION PICKER SCREEN
function Location({
  location,
  setLocation,
  back,
}: {
  location: string;
  setLocation: (v: string) => void;
  back: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = popularCities.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AuthShell>
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconButton}>
          <ArrowLeft size={24} color={colors.navy} />
        </Pressable>
        <Text style={styles.topStepIndicator}>Select Location</Text>
      </View>

      <View style={styles.locationSearchBox}>
        <Search size={20} color="#9AA5B8" />
        <TextInput
          placeholder="Search for your location"
          placeholderTextColor="#9AA5B8"
          value={query}
          onChangeText={setQuery}
          style={styles.textInput}
        />
      </View>

      <Pressable
        onPress={() => {
          setLocation('Bikaner, Rajasthan');
          back();
        }}
        style={styles.currentLocBtn}
      >
        <MapPin size={18} color={colors.primary} />
        <Text style={styles.linkText}>Use Current Location</Text>
      </Pressable>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleSmall}>Popular Cities</Text>
      </View>

      <View style={styles.cityGrid}>
        {filtered.map((city) => (
          <Pressable
            key={city}
            onPress={() => {
              setLocation(city);
              back();
            }}
            style={[styles.cityTile, location === city && styles.cityTileSelected]}
          >
            <MapPin
              size={14}
              color={location === city ? colors.primary : '#9AA5B8'}
            />
            <Text
              style={[
                styles.cityTileText,
                location === city && styles.cityTileTextSelected,
              ]}
            >
              {city}
            </Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton title="Confirm Location" onPress={back} />
    </AuthShell>
  );
}

// 8. HOME DASHBOARD
function Home({
  location,
  onLocation,
  openCategories,
  tab,
}: {
  location: string;
  onLocation: () => void;
  openCategories: () => void;
  tab: (s: Screen) => void;
}) {
  return (
    <AuthShell>
      <View style={styles.homeTopRow}>
        <Image
          source={require('../assets/images/logo_light.png')}
          style={styles.homeLogo}
          resizeMode="contain"
        />
        <View style={styles.homeActionsRow}>
          <LocationPill location={location} onPress={onLocation} />
          <Bell size={22} color={colors.navy} />
        </View>
      </View>

      <Text style={styles.homeGreetingText}>Hello, Rahul</Text>
      <Text style={styles.homeHeadlineText}>How can we help today?</Text>

      <View style={styles.locationSearchBox}>
        <Search size={20} color="#9AA5B8" />
        <TextInput
          placeholder="Search for a service"
          placeholderTextColor="#9AA5B8"
          style={styles.textInput}
        />
      </View>

      <LinearGradient colors={['#1E63C6', '#0F4EA7']} style={styles.bannerCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerEyebrow}>FAST, RELIABLE & LOCAL</Text>
          <Text style={styles.bannerHeading}>
            Fix it today.{'\n'}We'll handle the rest.
          </Text>
          <Pressable onPress={openCategories} style={styles.bannerBookBtn}>
            <Text style={styles.bannerBookBtnText}>Book a Service</Text>
          </Pressable>
        </View>
        <Wrench size={74} color="#ffffff88" />
      </LinearGradient>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleSmall}>Service Categories</Text>
        <Pressable onPress={openCategories}>
          <Text style={styles.linkText}>See All</Text>
        </Pressable>
      </View>

      <View style={styles.homeCategoriesGrid}>
        {categories.slice(0, 8).map(([name, sub, icon]) => (
          <Pressable
            key={name}
            onPress={openCategories}
            style={styles.homeCategoryItem}
          >
            <View style={styles.homeCategoryIconBox}>
              <Sparkles size={24} color={colors.primary} />
            </View>
            <Text style={styles.homeCategoryLabel} numberOfLines={2}>
              {name}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleSmall}>Recent Services</Text>
        <Text style={styles.linkText}>View All</Text>
      </View>

      {recentServices.map(([title, date]) => (
        <View key={title} style={styles.recentServiceCard}>
          <View style={styles.recentServiceIconBox}>
            <Wrench size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recentServiceTitle}>{title}</Text>
            <Text style={styles.recentServiceDate}>{date}</Text>
          </View>
          <Text style={styles.recentStatusCompleted}>Completed</Text>
          <ChevronRight size={18} color="#9AA5B8" />
        </View>
      ))}

      <View style={{ height: 90 }} />
      <BottomTabs active="home" tab={tab} />
    </AuthShell>
  );
}

// 9. CATEGORIES EXPLORER
function Categories({
  location,
  onLocation,
  back,
  tab,
}: {
  location: string;
  onLocation: () => void;
  back: () => void;
  tab: (s: Screen) => void;
}) {
  return (
    <AuthShell>
      <Header onBack={back} title="Service Categories" onLocation={onLocation} />
      <Text style={styles.profileHeading}>Service Categories</Text>
      <Text style={styles.profileSubheading}>What can we help you with?</Text>

      <View style={styles.locationSearchBox}>
        <Search size={20} color="#9AA5B8" />
        <TextInput
          placeholder="Search services"
          placeholderTextColor="#9AA5B8"
          style={styles.textInput}
        />
      </View>

      <View style={styles.homeCategoriesGrid}>
        {categories.map(([name, sub]) => (
          <View key={name} style={styles.homeCategoryItem}>
            <View style={styles.homeCategoryIconBox}>
              <Sparkles size={24} color={colors.primary} />
            </View>
            <Text style={styles.homeCategoryLabel}>{name}</Text>
            <Text style={styles.homeCategorySubLabel}>{sub}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 90 }} />
      <BottomTabs active="categories" tab={tab} />
    </AuthShell>
  );
}

// 10. PLACEHOLDER FOR TABS
function Placeholder({
  title,
  icon,
  tab,
}: {
  title: string;
  icon: React.ReactNode;
  tab: (s: Screen) => void;
}) {
  return (
    <AuthShell>
      <View style={styles.placeholderContainer}>
        <View style={styles.placeholderIconBox}>{icon}</View>
        <Text style={styles.profileHeading}>{title}</Text>
        <Text style={styles.bodyTextCenter}>Coming soon</Text>
      </View>
      <BottomTabs active={title.toLowerCase()} tab={tab} />
    </AuthShell>
  );
}

// BOTTOM TABS
function BottomTabs({
  active,
  tab,
}: {
  active: string;
  tab: (s: Screen) => void;
}) {
  const tabs = [
    { key: 'home', label: 'Home', icon: HomeIcon },
    { key: 'categories', label: 'Categories', icon: Sparkles },
    { key: 'bookings', label: 'Bookings', icon: CalendarDays },
    { key: 'messages', label: 'Messages', icon: MessageCircle },
    { key: 'profile', label: 'Profile', icon: UserRound },
  ];

  return (
    <View style={styles.bottomTabsBar}>
      {tabs.map((t) => {
        const IconComponent = t.icon;
        const isActive = active === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() =>
              tab(
                t.key === 'home'
                  ? 'home'
                  : t.key === 'categories'
                  ? 'categories'
                  : t.key === 'bookings'
                  ? 'bookings'
                  : t.key === 'messages'
                  ? 'messages'
                  : 'profileTab'
              )
            }
            style={styles.tabButton}
          >
            <IconComponent
              size={21}
              color={isActive ? colors.primary : '#9AA5B8'}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ROOT MAIN COMPONENT
export default function Index() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [screen, setScreen] = useState<Screen>('splash');
  const [location, setLocation] = useState('Bikaner, Rajasthan');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('nowfix_onboarding'),
      AsyncStorage.getItem('nowfix_logged_in'),
    ]).then(([seen, loggedIn]) => {
      // Keep splash first as user requested
    });
  }, []);

  const go = (nextScreen: Screen) => {
    setScreen(nextScreen);
    if (nextScreen === 'login') AsyncStorage.setItem('nowfix_onboarding', 'true');
    if (nextScreen === 'home') AsyncStorage.setItem('nowfix_logged_in', 'true');
  };

  const screenView = useMemo(() => {
    if (!fontsLoaded) return null;

    if (screen === 'splash') return <Splash next={() => go('onboarding')} />;
    if (screen === 'onboarding') return <Onboarding next={go} />;
    if (screen === 'login') {
      return (
        <Login
          next={go}
          onSubmit={setPhone}
          location={location}
          onLocation={() => go('location')}
        />
      );
    }
    if (screen === 'otp') {
      return <Otp next={go} phone={phone} back={() => go('login')} />;
    }
    if (screen === 'create') {
      return (
        <Create
          next={go}
          location={location}
          onLocation={() => go('location')}
          back={() => go('login')}
        />
      );
    }
    if (screen === 'profile') {
      return (
        <ProfileSetup
          next={go}
          location={location}
          onLocation={() => go('location')}
          back={() => go('create')}
        />
      );
    }
    if (screen === 'location') {
      return (
        <Location
          location={location}
          setLocation={setLocation}
          back={() => go('login')}
        />
      );
    }
    if (screen === 'home') {
      return (
        <Home
          location={location}
          onLocation={() => go('location')}
          openCategories={() => go('categories')}
          tab={go}
        />
      );
    }
    if (screen === 'categories') {
      return (
        <Categories
          location={location}
          onLocation={() => go('location')}
          back={() => go('home')}
          tab={go}
        />
      );
    }
    if (screen === 'bookings') {
      return (
        <Placeholder
          title="Bookings"
          icon={<CalendarDays size={32} color={colors.primary} />}
          tab={go}
        />
      );
    }
    if (screen === 'messages') {
      return (
        <Placeholder
          title="Messages"
          icon={<MessageCircle size={32} color={colors.primary} />}
          tab={go}
        />
      );
    }
    return (
      <Placeholder
        title="Profile"
        icon={<UserRound size={32} color={colors.primary} />}
        tab={go}
      />
    );
  }, [fontsLoaded, screen, location, phone]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {screenView}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },

  // Splash Screen (Full Screen Image from Image 1)
  splashScreen: {
    flex: 1,
    backgroundColor: '#1E62C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashFullImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  // Top Bars & Headers
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  topActionText: {
    fontFamily: typography.semibold,
    color: colors.primary,
    fontSize: 15,
  },
  topStepIndicator: {
    fontFamily: typography.semibold,
    color: colors.primary,
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerTitle: {
    fontFamily: typography.semibold,
    fontSize: 17,
    color: colors.navy,
    flex: 1,
    marginLeft: 10,
  },
  headerLogoCompact: {
    width: 100,
    height: 38,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Centered Light Logo (matching screenshots)
  logoCentered: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  logoLight: {
    width: 220,
    height: 155,
  },

  // Taglines & Hero Texts
  tagline: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 19,
  },
  onboardTextContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 8,
  },
  heroTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    lineHeight: 30,
    color: colors.navy,
    textAlign: 'center',
  },
  bodyTextCenter: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },

  // Onboarding Hero (Image 5)
  onboardHeroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 16,
  },
  onboardHeroImg: {
    width: '100%',
    height: 285,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: 16,
  },
  dotActivePill: {
    width: 22,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D6E4F6',
  },

  // Primary Action Button
  primaryButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: '#AFC8E9',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 16,
  },
  underButton: {
    textAlign: 'center',
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 12,
    marginTop: 12,
  },

  // Fort Footer (Watercolor architecture silhouette)
  fortContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    overflow: 'hidden',
  },
  fortImage: {
    width: '100%',
    height: 110,
  },

  // Categories Row (Row of 4 icons from Image 2 & 4)
  categoryRowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  categoryRowImg: {
    width: '100%',
    height: 82,
  },

  // Main Card Container (White with subtle shadow)
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    shadowColor: '#0F1B3D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F4FA',
  },
  cardTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.navy,
  },
  cardSubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
    marginBottom: 12,
  },

  // Input Fields & Rows
  fieldRow: {
    minHeight: 52,
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
  fieldIcon: {
    marginRight: 2,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.navy,
    minHeight: 46,
  },
  floatingLabel: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  textInputWithLabel: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.navy,
    paddingTop: 1,
    paddingBottom: 2,
  },
  locationFieldValue: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.navy,
    flex: 1,
  },
  errorField: {
    borderColor: colors.danger,
  },
  errorText: {
    fontFamily: typography.regular,
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },

  // Country Code Picker
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 6,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.navy,
  },
  vDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#DFE7F3',
    marginRight: 4,
  },

  // Inline Send OTP button
  sendOtpBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  sendOtpBtnActive: {
    backgroundColor: '#1052B3',
  },
  sendOtpBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.semibold,
    fontSize: 12,
  },
  resendInlineText: {
    fontFamily: typography.medium,
    color: colors.primary,
    fontSize: 11,
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD7E6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSquareChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.navy,
  },

  // Links & Dividers
  linkText: {
    fontFamily: typography.semibold,
    color: colors.primary,
  },
  linkTextBold: {
    fontFamily: typography.bold,
    color: colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    marginBottom: 10,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#DFE7F3',
    flex: 1,
  },
  dividerText: {
    fontFamily: typography.regular,
    color: '#9AA5B8',
    fontSize: 12,
  },

  // Social Buttons
  socialRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  socialBtn: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  socialBtnText: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.navy,
  },
  googleIcon: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: '#4285F4',
  },
  appleIcon: {
    fontSize: 16,
    color: '#111111',
  },
  termsText: {
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
  },
  switchAuth: {
    marginTop: 12,
    alignItems: 'center',
  },
  switchAuthText: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.navy,
  },

  // Profile Setup Screen (Image 3)
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    paddingHorizontal: 16,
  },
  stepperItem: {
    alignItems: 'center',
    width: 60,
  },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#5A9BE8',
    marginHorizontal: 4,
    marginBottom: 20,
  },
  stepCircleDone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5A9BE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActiveNumber: {
    color: '#FFFFFF',
    fontFamily: typography.bold,
    fontSize: 14,
  },
  stepLabelText: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 13,
  },
  stepLabelActive: {
    color: colors.primary,
    fontFamily: typography.semibold,
  },
  profileHeading: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.navy,
    marginTop: 10,
  },
  profileSubheading: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },
  avatarUploader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarCircleDashed: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1.8,
    borderColor: '#7EAFEB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FF',
  },
  avatarInnerBlue: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#E4EFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTitleText: {
    fontFamily: typography.semibold,
    color: colors.primary,
    fontSize: 13,
    marginTop: 8,
  },
  avatarOptionalText: {
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 11,
  },
  profileInputWrapper: {
    gap: 6,
  },
  infoCallout: {
    backgroundColor: '#EEF5FE',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  infoHomeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCalloutText: {
    fontFamily: typography.regular,
    color: '#556885',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },

  // Location Pills
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.softBlue,
    borderRadius: radius.pill,
  },
  locationText: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.primary,
  },

  // OTP Screen
  otpBubbleCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EEF5FE',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  otpBoxSingle: {
    width: 46,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#DFE7F3',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontFamily: typography.semibold,
    fontSize: 22,
    color: colors.navy,
  },
  resendCenterText: {
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  securityBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  securityBadgeItem: {
    alignItems: 'center',
    gap: 4,
  },
  securityBadgeText: {
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 10,
  },

  // Location Selector
  locationSearchBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginTop: 10,
  },
  currentLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitleSmall: {
    fontFamily: typography.semibold,
    fontSize: 16,
    color: colors.navy,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  cityTile: {
    width: '23%',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  cityTileSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.softBlue,
  },
  cityTileText: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: colors.navy,
    textAlign: 'center',
  },
  cityTileTextSelected: {
    color: colors.primary,
  },

  // Home Dashboard
  homeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  homeLogo: {
    width: 100,
    height: 38,
  },
  homeActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeGreetingText: {
    fontFamily: typography.regular,
    color: '#6B7280',
    marginTop: 14,
    fontSize: 14,
  },
  homeHeadlineText: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.navy,
    marginBottom: 6,
  },
  bannerCard: {
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerEyebrow: {
    fontFamily: typography.semibold,
    fontSize: 10,
    color: '#CBE3FF',
    letterSpacing: 0.5,
  },
  bannerHeading: {
    fontFamily: typography.bold,
    fontSize: 18,
    lineHeight: 24,
    color: '#FFFFFF',
    marginTop: 4,
  },
  bannerBookBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bannerBookBtnText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.primary,
  },
  homeCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  homeCategoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 12,
  },
  homeCategoryIconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeCategoryLabel: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.navy,
    textAlign: 'center',
    marginTop: 5,
  },
  homeCategorySubLabel: {
    fontFamily: typography.regular,
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },
  recentServiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0F4FA',
  },
  recentServiceIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentServiceTitle: {
    fontFamily: typography.medium,
    color: colors.navy,
    fontSize: 13,
  },
  recentServiceDate: {
    fontFamily: typography.regular,
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  recentStatusCompleted: {
    fontFamily: typography.medium,
    color: colors.success,
    fontSize: 10,
    backgroundColor: '#E7F7ED',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },

  // Bottom Navigation Bar
  bottomTabsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#DFE7F3',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    gap: 3,
    minWidth: 54,
  },
  tabLabel: {
    fontFamily: typography.medium,
    fontSize: 10,
    color: '#9AA5B8',
  },
  tabLabelActive: {
    color: colors.primary,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  placeholderIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.softBlue,
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
    elevation: 4,
  },
  toastText: {
    color: '#FFFFFF',
    fontFamily: typography.medium,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.85,
  },
});
