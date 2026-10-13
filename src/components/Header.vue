<script setup lang="ts">

const route = useRoute()
const router = useRouter()
const { theme, toggleTheme } = useTheme()
const localePath = useLocalePath()
const { isAuthenticated, user, logout } = useAuth()
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const showLoginPopup = ref(false)
const showMobileMenu = ref(false)
const showAccountMenu = ref(false)
const accountMenuRef = ref<HTMLElement | null>(null)

const languages = ['vi', 'en'] as const

const handleLogout = () => {
    showAccountMenu.value = false
    ElMessageBox.confirm(
        t('auth.logoutConfirm'),
        t('common.warning'),
        {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning',
            center: true,
        }
    )
        .then(() => {
            logout()
            router.push('/')

            ElMessage({
                type: 'success',
                message: t('auth.logoutSuccess'),
            })
        })

}

// Menu items với i18n
const menuItems = computed(() => [
    { name: t('nav.home'), path: localePath('/') },
    { name: t('nav.about'), path: localePath('/about') },
    { name: t('nav.tours'), path: localePath('/tour') },
    { name: t('nav.hotSpots'), path: localePath('/hot-spots') },
    // { name: t('nav.services'), path: localePath('/service') },
    { name: t('nav.news'), path: localePath('/news') },
    { name: t('nav.blog'), path: localePath('/blog') },
    { name: t('nav.contact'), path: localePath('/contact') },
])

const { openDrawer: openWishlistDrawer } = useWishlistDrawer();

const { data: wishlistCount } = useWishlistCountQuery();
const wishlistCountDisplay = computed(() => wishlistCount.value || 0);

// Server không biết theme của người dùng (color-mode = system), chỉ hiển thị theo theme sau khi mount
// để HTML server và lần render đầu ở client giống nhau.
const isMounted = ref(false)
const isDark = computed(() => isMounted.value && theme.value === 'dark')
const themeLabel = computed(() => (isDark.value ? t('nav.lightMode') : t('nav.darkMode')))

const isActive = (path: string) => {
    const homePath = localePath('/')
    if (path === homePath) {
        return route.path === homePath
    }
    return route.path.startsWith(path)
}

const openWishlist = () => {
    showAccountMenu.value = false
    showMobileMenu.value = false
    openWishlistDrawer()
}

function formLogin() {
    showMobileMenu.value = false
    showLoginPopup.value = true
}

onClickOutside(accountMenuRef, () => {
    showAccountMenu.value = false
})

watch(() => route.fullPath, () => {
    showMobileMenu.value = false
    showAccountMenu.value = false
})

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        showMobileMenu.value = false
        showAccountMenu.value = false
    }
}

onMounted(() => {
    isMounted.value = true
    window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
    <header class="site-header">
        <div class="shell site-header__bar">
            <NuxtLink :to="localePath('/')" class="site-header__logo">
                <img src="/logo.png" class="dark:hidden" alt="ANDAGO" width="976" height="557">
                <img src="/logo_dark.png" class="hidden dark:block" alt="ANDAGO" width="976" height="557">
            </NuxtLink>

            <!-- Desktop Navigation -->
            <nav class="site-nav" :aria-label="t('nav.mainMenu')">
                <ul role="list">
                    <li v-for="item in menuItems" :key="item.path">
                        <NuxtLink :to="item.path" class="nav-link"
                            :aria-current="isActive(item.path) ? 'page' : undefined">
                            {{ item.name }}
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

            <div class="site-header__actions">
                <div class="lang-switch site-header__wide" role="group" :aria-label="t('common.language')">
                    <NuxtLink v-for="code in languages" :key="code" :to="switchLocalePath(code)" :lang="code"
                        :aria-current="locale === code ? 'true' : undefined">
                        {{ code.toUpperCase() }}
                    </NuxtLink>
                </div>

                <button type="button" class="icon-btn site-header__wide" :aria-label="themeLabel" :title="themeLabel"
                    @click="toggleTheme">
                    <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                        <path stroke-linecap="round"
                            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z" />
                    </svg>
                </button>

                <button v-if="isAuthenticated" type="button" class="icon-btn site-header__wide"
                    :aria-label="t('wishlist.title')" :title="t('wishlist.title')" @click="openWishlist">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />
                    </svg>
                    <span v-if="wishlistCountDisplay > 0" class="icon-btn__count">{{ wishlistCountDisplay }}</span>
                </button>

                <!-- Tài khoản -->
                <button v-if="!isAuthenticated" type="button" class="text-btn site-header__wide" @click="formLogin">
                    {{ t('auth.login') }}
                </button>
                <div v-else ref="accountMenuRef" class="account site-header__wide">
                    <button type="button" class="account__trigger" aria-haspopup="true"
                        :aria-expanded="showAccountMenu" @click="showAccountMenu = !showAccountMenu">
                        <img v-if="user?.avatar" :src="user.avatar" alt="" class="account__avatar">
                        <span class="account__name">{{ user?.userName || 'User' }}</span>
                    </button>
                    <div v-show="showAccountMenu" class="account__menu">
                        <div class="account__identity">
                            <p class="account__identity-name">{{ user?.userName }}</p>
                            <p class="account__identity-email">{{ user?.email }}</p>
                        </div>
                        <NuxtLink :to="localePath('/profile')">{{ t('auth.profile') }}</NuxtLink>
                        <NuxtLink :to="localePath('/profile/bookings')">{{ t('auth.myBookings') }}</NuxtLink>
                        <button type="button" @click="openWishlist">{{ t('wishlist.myWishlist') }}</button>
                        <button type="button" class="account__logout" @click="handleLogout">{{ t('auth.logout')
                            }}</button>
                    </div>
                </div>

                <UiButton :to="localePath('/tour')" variant="ink" size="sm">{{ t('nav.bookTour') }}</UiButton>

                <button type="button" class="menu-toggle" aria-controls="site-mobile-menu"
                    :aria-expanded="showMobileMenu" @click="showMobileMenu = !showMobileMenu">
                    {{ showMobileMenu ? t('nav.closeMenu') : t('nav.menu') }}
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div v-show="showMobileMenu" id="site-mobile-menu" class="mobile-menu">
            <div class="shell">
                <nav :aria-label="t('nav.mainMenu')">
                    <ul role="list" class="mobile-menu__nav">
                        <li v-for="item in menuItems" :key="item.path">
                            <NuxtLink :to="item.path" class="nav-link"
                                :aria-current="isActive(item.path) ? 'page' : undefined">
                                {{ item.name }}
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>

                <div class="mobile-menu__account">
                    <button v-if="!isAuthenticated" type="button" class="text-btn" @click="formLogin">
                        {{ t('auth.login') }}
                    </button>
                    <template v-else>
                        <NuxtLink :to="localePath('/profile')">{{ t('auth.profile') }}</NuxtLink>
                        <NuxtLink :to="localePath('/profile/bookings')">{{ t('auth.myBookings') }}</NuxtLink>
                        <button type="button" @click="openWishlist">
                            {{ t('wishlist.myWishlist') }} ({{ wishlistCountDisplay }})
                        </button>
                        <button type="button" class="account__logout" @click="handleLogout">{{ t('auth.logout')
                            }}</button>
                    </template>
                </div>

                <div class="mobile-menu__prefs">
                    <div class="lang-switch" role="group" :aria-label="t('common.language')">
                        <NuxtLink v-for="code in languages" :key="code" :to="switchLocalePath(code)" :lang="code"
                            :aria-current="locale === code ? 'true' : undefined">
                            {{ code.toUpperCase() }}
                        </NuxtLink>
                    </div>
                    <button type="button" class="text-btn" @click="toggleTheme">{{ themeLabel }}</button>
                </div>
            </div>
        </div>

        <LoginPopup v-model="showLoginPopup" />
        <WishlistDrawer />
    </header>
</template>

<style scoped>
.site-header {
    position: sticky;
    top: 0;
    z-index: 999;
    background: var(--color-bg);
    background: color-mix(in srgb, var(--color-bg) 84%, transparent);
    -webkit-backdrop-filter: saturate(140%) blur(14px);
    backdrop-filter: saturate(140%) blur(14px);
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-sans);
}

.site-header__bar {
    display: flex;
    align-items: center;
    gap: var(--space-fluid-sm);
    min-height: var(--header-height);
}

.site-header__logo {
    display: flex;
    flex-shrink: 0;
}

.site-header__logo img {
    height: 3.25rem;
    width: auto;
}

/* nav.* trong i18n viết hoa toàn bộ; hiển thị lại dạng câu: "Trang chủ", "Giới thiệu"... */
.nav-link {
    display: inline-block;
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    text-decoration: none;
    text-transform: lowercase;
}

.nav-link::first-letter {
    text-transform: uppercase;
}

.nav-link:hover,
.nav-link[aria-current='page'] {
    color: var(--color-text);
}

.nav-link[aria-current='page'] {
    font-weight: var(--weight-medium);
}

.site-nav {
    display: none;
    margin-inline: auto;
}

.site-nav ul {
    display: flex;
    gap: var(--space-fluid-sm);
}

.site-nav .nav-link {
    padding-block: var(--space-2);
    border-bottom: 1px solid transparent;
}

.site-nav .nav-link[aria-current='page'] {
    border-bottom-color: var(--color-accent);
}

.site-header__actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-left: auto;
}

.site-header__wide {
    display: none !important;
}

.lang-switch {
    display: inline-flex;
    padding: 3px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
}

.lang-switch a {
    padding: 0.3rem 0.65rem;
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
}

.lang-switch a:hover {
    color: var(--color-text);
}

.lang-switch a[aria-current='true'] {
    background: var(--color-text);
    color: var(--color-bg);
}

.icon-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    transition: color var(--transition-base), background-color var(--transition-base);
}

.icon-btn:hover {
    color: var(--color-text);
    background: var(--color-bg-subtle);
}

.icon-btn svg {
    width: 1.25rem;
    height: 1.25rem;
}

.icon-btn__count {
    position: absolute;
    top: 0.2rem;
    right: 0.1rem;
    min-width: 1rem;
    padding: 0 var(--space-1);
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    color: var(--color-on-accent);
    font-size: var(--text-micro);
    font-weight: var(--weight-semibold);
    line-height: 1rem;
}

.text-btn,
.menu-toggle {
    min-height: 2.5rem;
    padding: 0 var(--space-2);
    color: var(--color-text);
    font-size: var(--text-ui);
    font-weight: var(--weight-medium);
}

.text-btn:hover {
    color: var(--color-accent);
}

.menu-toggle {
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.35em;
}

/* Tài khoản */
.account {
    position: relative;
}

.account__trigger {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-height: 2.5rem;
    padding: 0 var(--space-2);
    color: var(--color-text);
    font-size: var(--text-ui);
}

.account__avatar {
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    object-fit: cover;
}

.account__name {
    max-width: 7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.account__menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    z-index: 10;
    display: grid;
    min-width: 14rem;
    padding: var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    box-shadow: var(--shadow-popover);
}

.account__menu a,
.account__menu button {
    padding: 0.625rem var(--space-3);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: var(--text-ui);
    text-align: left;
    text-decoration: none;
}

.account__menu a:hover,
.account__menu button:hover {
    background: var(--color-bg-subtle);
}

.account__identity {
    padding: var(--space-2) var(--space-3) var(--space-3);
    margin-bottom: var(--space-1);
    border-bottom: 1px solid var(--color-border);
}

.account__identity-name {
    font-weight: var(--weight-medium);
}

.account__identity-email {
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-overflow: ellipsis;
}

.account__logout {
    color: var(--color-danger) !important;
}

/* Mobile menu */
.mobile-menu {
    max-height: calc(100vh - var(--header-height));
    overflow-y: auto;
    border-top: 1px solid var(--color-border);
    padding-block: var(--space-2) var(--space-6);
}

.mobile-menu__nav li + li {
    border-top: 1px solid var(--color-border);
}

.mobile-menu__nav .nav-link {
    display: block;
    padding-block: 0.875rem;
    color: var(--color-text);
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
}

.mobile-menu__nav .nav-link[aria-current='page'] {
    color: var(--color-accent);
    font-style: italic;
}

.mobile-menu__account {
    display: grid;
    justify-items: start;
    gap: var(--space-1);
    margin-top: var(--space-2);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.mobile-menu__account a,
.mobile-menu__account button {
    padding-block: var(--space-2);
    color: var(--color-text);
    font-size: var(--text-base);
    text-decoration: none;
}

.mobile-menu__account .text-btn {
    padding-inline: 0;
}

.mobile-menu__prefs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.site-header a:focus-visible,
.site-header button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

@media (min-width: 40rem) {
    .site-header__wide {
        display: inline-flex !important;
        align-items: center;
    }

    .mobile-menu__account,
    .mobile-menu__prefs {
        display: none;
    }
}

@media (min-width: 75rem) {
    .site-nav {
        display: block;
    }

    .site-header__actions {
        margin-left: 0;
    }

    .menu-toggle,
    .mobile-menu {
        display: none !important;
    }
}
</style>
