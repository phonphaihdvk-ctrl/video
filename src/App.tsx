import React, { useState, useEffect, useRef } from 'react';
import {
  googleSignIn,
  googleSignOut,
  fetchDriveVideos,
  uploadMediaToDriveXHR,
  deleteDriveFile,
  updateDriveFileCategory,
  getDriveMediaBlobUrl,
  generateVideoThumbnail,
  saveDriveCache,
  getDriveCache,
  DriveVideoFile,
  UploadProgressInfo,
  UploadController,
  auth,
  signInWithGIS,
  getGoogleClientId,
  getGoogleApiKey,
  setGoogleApiConfig,
  setAccessTokenInMemory,
  VaultUserSession,
} from './utils/googleDrive';


export type Language = 'km' | 'en';

export const TRANSLATIONS = {
  en: {
    appName: 'HD Media Vault',
    appSubtitle: 'Cloud Connected',
    cloudConnected: 'Cloud Connected',
    syncingDrive: 'Syncing with Cloud Drive...',
    uploadMedia: 'Upload Media',
    upload: 'Upload',
    videoVault: 'Video Vault',
    photoVault: 'Photo Vault',
    videoFolders: 'Video Folders',
    photoFolders: 'Photo Folders',
    allMedia: 'All Media',
    favorites: 'Favorites',
    items: 'items',
    videos: 'videos',
    photos: 'photos',
    addFolderTextOnly: 'Add Folder',
    addVideoFolder: 'Add Video Folder',
    addPhotoFolder: 'Add Photo Folder',
    exploreFolder: 'Explore Folder ›',
    emptyFolder: 'This folder is empty. Upload media to get started!',
    allFolders: 'All Folders',
    allVideoFolders: 'All Video Folders',
    allPhotoFolders: 'All Photo Folders',
    rename: 'Rename',
    delete: 'Delete',
    move: 'Move Folder',
    changePin: 'Change PIN',
    lockPin: 'Lock with PIN',
    qrLogin: 'Camera QR Login',
    signOut: 'Sign Out',
    signOutComplete: 'Sign Out Completely',
    signInGoogle: 'Sign in with Google (Cloud Sync)',
    signInGmailPin: 'Sign in with Gmail & Custom PIN',
    firstTimePinHint: 'First time signing in? Enter any 4-digit PIN to secure your vault.',
    enterPin: 'Enter 4-digit PIN',
    developerApproval: 'Developer Approval Panel (Admin: Phon Phal)',
    devAdminPanel: 'Developer Admin Panel',
    openDevPanel: 'Open Developer Admin Panel',
    developerBadge: 'Developer Approved (Super Admin)',
    verifiedMember: 'Verified Vault Member',
    accessPending: 'Access Pending Developer Approval',
    pendingDesc: 'Your account is pending review by Developer Admin Phon Phal (phonphaihdvk@gmail.com).',
    videoQuality: 'Video Quality',
    qualityAuto: 'Auto (Original Stream)',
    quality1080: '1080p Full HD',
    quality720: '720p HD',
    quality480: '480p SD',
    quality360: '360p SD',
    portrait: 'Portrait',
    landscape: 'Landscape',
    mute: 'Mute',
    unmute: 'Unmute',
    cameraScanTitle: 'Active Camera QR Scanner',
    cameraScanDesc: 'Point device camera at a Vault QR code to log in directly',
    scanningCamera: 'Scanning active camera feed...',
    startCamera: 'Start Camera',
    stopCamera: 'Stop Camera',
    simulateScan: 'Simulate Quick Login',
    storageDisplay: 'Cloud Storage Status',
    storageTier: 'Google Drive Cloud Storage (5 TB)',
    storageUsage: 'Cloud Storage Usage',
    usedOf: 'used of',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    actions: 'Media Actions',
    renameMedia: 'Rename Media File',
    deleteMediaConfirm: 'Are you sure you want to delete this media item?',
    confirmDeleteDriveTitle: 'Delete from Google Drive',
    confirmDeleteDriveMsg: 'Are you sure you want to delete this file from your Google Drive? This action will permanently remove it from your cloud storage and cannot be undone.',
    deletingDrive: 'Deleting from Google Drive...',
    deleteSuccessDrive: 'permanently deleted from Google Drive!',
    deletePermanently: 'Delete Permanently',
    cannotDeleteTitle: 'Cannot Delete Folder',
    cannotDeleteFolderNonEmpty: 'This folder contains items. Please transfer or move all files to another folder before deleting.',
    confirmDeleteFolderTitle: 'Delete Folder',
    confirmDeleteFolderMsg: 'Are you sure you want to delete this folder?',
    understood: 'Understood',
    folderOptions: 'Folder Options',
    language: 'Language',
    uploadVideo: 'Upload Video',
    uploadPhoto: 'Upload Photo',
    uploadVideoDesc: 'MP4, WebM, MKV, MPEG-TS (.ts)',
    uploadPhotoDesc: 'JPG, PNG, WEBP, GIF, High-Res',
    selectUploadType: 'Choose Media Type to Upload',
    lockFolder: 'Lock Folder',
    unlockFolder: 'Unlock Folder',
    lockedFolderBadge: 'Locked',
    setFolderPinTitle: 'Lock Folder with PIN & Birthday',
    setFolderPinDesc: 'Set a 4-digit PIN and Date of Birth as security recovery.',
    enterFolderPin: 'Enter 4-Digit Folder PIN',
    dateOfBirthRecovery: 'Date of Birth (Security Recovery)',
    birthdayUnlockOption: 'Forgot PIN? Unlock with Birthday',
    backToPin: 'Back to PIN',
    verifyBirthday: 'Verify Birthday & Unlock',
    incorrectPin: 'Incorrect PIN. Try again or unlock with birthday.',
    incorrectDob: 'Date of Birth does not match. Please verify.',
    folderLockedSuccess: 'Folder locked successfully.',
    folderUnlockedSuccess: 'Folder unlocked successfully.',
    removeLock: 'Remove Folder Lock',
    selectTargetFolder: 'Select Target Folder',
    selectTargetFolderDesc: 'Choose which folder to save this file into before uploading.',
    confirmAndUpload: 'Confirm & Upload',
    enterNewFolderName: 'Or create new folder name',
    devApiConfig: 'Developer / API Configuration',
    devApiConfigDesc: 'Configure Google Client ID & API Key for standalone Netlify deployment.',
    googleClientIdLabel: 'Google OAuth Client ID',
    googleApiKeyLabel: 'Google Drive API Key',
    saveCredentials: 'Save Credentials',
    credentialsSaved: 'Credentials saved successfully!',
    demoGuestMode: 'One-Click Demo Guest',
    demoGuestDesc: 'Instant access with demo videos and photos',
    popoutDrive: 'Pop-out Full Window',
    connectedDriveStorage: 'Connected: phonphaihdvk@gmail.com • 5 TB Google Drive Storage',
  },
  km: {
    appName: 'HD Media Vault',
    appSubtitle: 'ភ្ជាប់គណនីក្លោដ',
    cloudConnected: 'ភ្ជាប់គណនីក្លោដ',
    syncingDrive: 'កំពុងធ្វើសមកាលកម្មក្លោដ...',
    uploadMedia: 'ផ្ទុកឡើងមេឌៀ',
    upload: 'ផ្ទុកឡើង',
    videoVault: 'ឃ្លាំងវីដេអូ',
    photoVault: 'ឃ្លាំងរូបភាព',
    videoFolders: 'ថតវីដេអូ',
    photoFolders: 'ថតរូបភាព',
    allMedia: 'មេឌៀទាំងអស់',
    favorites: 'ឯកសារពេញចិត្ត',
    items: 'ឯកសារ',
    videos: 'វីដេអូ',
    photos: 'រូបភាព',
    addFolderTextOnly: 'បន្ថែមថត',
    addVideoFolder: 'បន្ថែមថតវីដេអូ',
    addPhotoFolder: 'បន្ថែមថតរូបភាព',
    exploreFolder: 'បើកមើលថតនេះ ›',
    emptyFolder: 'ថតនេះមិនទាន់មានឯកសារនៅឡើយទេ។ សូមផ្ទុកឡើងដើម្បីចាប់ផ្ដើម!',
    allFolders: 'ថតទាំងអស់',
    allVideoFolders: 'ថតវីដេអូទាំងអស់',
    allPhotoFolders: 'ថតរូបភាពទាំងអស់',
    rename: 'ប្ដូរឈ្មោះ',
    delete: 'លុបចេញ',
    move: 'ប្តូរថត',
    changePin: 'ប្ដូរលេខកូដសម្ងាត់',
    lockPin: 'ចាក់សោ PIN',
    qrLogin: 'ស្កេនកាមេរ៉ា QR ចូលប្រើ',
    signOut: 'ចាកចេញ',
    signOutComplete: 'ចាកចេញទាំងស្រុង',
    signInGoogle: 'ចូលដោយគណនី Google (ធ្វើសមកាលកម្ម)',
    signInGmailPin: 'ចូលដោយ Gmail និងលេខសម្ងាត់ PIN',
    firstTimePinHint: 'ចុះឈ្មោះលើកដំបូង? បញ្ចូលលេខកូដ ៤ ខ្ទង់ផ្ទាល់ខ្លួនរបស់អ្នក។',
    enterPin: 'បញ្ចូលលេខកូដសម្ងាត់ ៤ ខ្ទង់',
    developerApproval: 'ផ្ទាំងគ្រប់គ្រងអ្នកអភិវឌ្ឍន៍ (Admin: Phon Phal)',
    devAdminPanel: 'ផ្ទាំងគ្រប់គ្រងអ្នកអភិវឌ្ឍន៍',
    openDevPanel: 'បើកផ្ទាំងគ្រប់គ្រងអ្នកអភិវឌ្ឍន៍',
    developerBadge: 'បានអនុម័តដោយ Developer (Super Admin)',
    verifiedMember: 'សមាជិក Vault ផ្លូវការ',
    accessPending: 'កំពុងរង់ចាំការអនុម័តពី Developer',
    pendingDesc: 'គណនីរបស់អ្នកកំពុងរង់ចាំការយល់ព្រមពី Developer Admin Phon Phal (phonphaihdvk@gmail.com)។',
    videoQuality: 'កម្រិតគុណភាពវីដេអូ',
    qualityAuto: 'ស្វ័យប្រវត្តិ (Auto Original)',
    quality1080: '1080p កម្រិតច្បាស់ Full HD',
    quality720: '720p HD',
    quality480: '480p SD',
    quality360: '360p SD',
    portrait: 'បញ្ឈរ (Portrait)',
    landscape: 'ផ្ដេក (Landscape)',
    mute: 'បិទសំឡេង',
    unmute: 'បើកសំឡេង',
    cameraScanTitle: 'ម៉ាស៊ីនស្កេនកាមេរ៉ា QR Code',
    cameraScanDesc: 'តម្រង់កាមេរ៉ារបស់អ្នកទៅកាន់កូដ QR ដើម្បីចូលប្រើភ្លាមៗ',
    scanningCamera: 'កំពុងស្កេនតាមកាមេរ៉ា...',
    startCamera: 'បើកកាមេរ៉ា',
    stopCamera: 'បិទកាមេរ៉ា',
    simulateScan: 'ចូលប្រើសាកល្បងភ្លាមៗ',
    storageDisplay: 'ទំហំផ្ទុកទិន្នន័យក្លោដ',
    storageTier: 'ទំហំផ្ទុក Google Drive (5 TB)',
    storageUsage: 'ទំហំផ្ទុកទិន្នន័យក្លោដប្រើប្រាស់',
    usedOf: 'បានប្រើនៃ',
    cancel: 'បោះបង់',
    save: 'រក្សាទុក',
    create: 'បង្កើតថ្មី',
    actions: 'ជម្រើសឯកសារ',
    renameMedia: 'ប្ដូរឈ្មោះឯកសារ',
    deleteMediaConfirm: 'តើអ្នកពិតជាចង់លុបឯកសារមេឌៀនេះមែនទេ?',
    confirmDeleteDriveTitle: 'លុបចេញពី Google Drive',
    confirmDeleteDriveMsg: 'តើអ្នកពិតជាចង់លុបឯកសារនេះចេញពី Google Drive របស់អ្នកមែនទេ? សកម្មភាពនេះនឹងលុបឯកសារជាអចិន្ត្រៃយ៍ និងមិនអាចត្រឡប់វិញបានទេ។',
    deletingDrive: 'កំពុងលុបចេញពី Google Drive...',
    deleteSuccessDrive: 'បានលុបចេញពី Google Drive ជាអចិន្ត្រៃយ៍!',
    deletePermanently: 'លុបជាអចិន្ត្រៃយ៍',
    cannotDeleteTitle: 'មិនអាចលុបថតនេះបានទេ',
    cannotDeleteFolderNonEmpty: 'ថតនេះមានផ្ទុកឯកសារ។ សូមផ្ទេរ ឬផ្លាស់ប្ដូរឯកសារទាំងអស់ទៅថតផ្សេងទៀតសិន មុនពេលលុប។',
    confirmDeleteFolderTitle: 'លុបថត',
    confirmDeleteFolderMsg: 'តើអ្នកពិតជាចង់លុបថតនេះមែនទេ?',
    understood: 'យល់ព្រម',
    folderOptions: 'ជម្រើសថត',
    language: 'ភាសា',
    uploadVideo: 'ផ្ទុកឡើងវីដេអូ',
    uploadPhoto: 'ផ្ទុកឡើងរូបថត',
    uploadVideoDesc: 'MP4, WebM, MKV, MPEG-TS (.ts)',
    uploadPhotoDesc: 'JPG, PNG, WEBP, GIF កម្រិតច្បាស់',
    selectUploadType: 'ជ្រើសរើសប្រភេទឯកសារដើម្បីផ្ទុកឡើង',
    lockFolder: 'ចាក់សោថត',
    unlockFolder: 'ដោះសោថត',
    lockedFolderBadge: 'បានចាក់សោ',
    setFolderPinTitle: 'ចាក់សោថតដោយលេខ PIN និងថ្ងៃកំណើត',
    setFolderPinDesc: 'កំណត់លេខសម្ងាត់ ៤ខ្ទង់ និងថ្ងៃខែឆ្នាំកំណើតសម្រាប់សង្គ្រោះសុវត្ថិភាព។',
    enterFolderPin: 'បញ្ចូលលេខសម្ងាត់ថត ៤ខ្ទង់',
    dateOfBirthRecovery: 'ថ្ងៃខែឆ្នាំកំណើត (សម្រាប់សង្គ្រោះ)',
    birthdayUnlockOption: 'ភ្លេច PIN? ដោះសោជាមួយថ្ងៃកំណើត',
    backToPin: 'ត្រឡប់ទៅលេខកូដ PIN',
    verifyBirthday: 'ផ្ទៀងផ្ទាត់ថ្ងៃកំណើត & ដោះសោ',
    incorrectPin: 'លេខសម្ងាត់មិនត្រឹមត្រូវ។ សូមព្យាយាមម្ដងទៀត ឬដោះសោដោយថ្ងៃកំណើត។',
    incorrectDob: 'ថ្ងៃខែឆ្នាំកំណើតមិនត្រូវគ្នាទេ។ សូមពិនិត្យឡើងវិញ។',
    folderLockedSuccess: 'បានចាក់សោថតដោយជោគជ័យ។',
    folderUnlockedSuccess: 'បានដោះសោថតដោយជោគជ័យ។',
    removeLock: 'ដោះសោថតចេញ',
    selectTargetFolder: 'ជ្រើសរើសថតគោលដៅ',
    selectTargetFolderDesc: 'ជ្រើសរើសថតដែលត្រូវរក្សាទុកឯកសារនេះ មុនពេលចាប់ផ្ដើមផ្ទុកឡើង។',
    confirmAndUpload: 'បញ្ជាក់ & ផ្ទុកឡើង',
    enterNewFolderName: 'ឬបង្កើតឈ្មោះថតថ្មី',
    devApiConfig: 'ការកំណត់អ្នកអភិវឌ្ឍន៍ / Google API',
    devApiConfigDesc: 'កំណត់ Google Client ID & API Key សម្រាប់ដាក់ឱ្យដំណើរការនៅលើ Netlify។',
    googleClientIdLabel: 'Google OAuth Client ID',
    googleApiKeyLabel: 'Google Drive API Key',
    saveCredentials: 'រក្សាទុកព័ត៌មានសម្ងាត់',
    credentialsSaved: 'បានរក្សាទុកព័ត៌មានសម្ងាត់ដោយជោគជ័យ!',
    demoGuestMode: 'ចូលសាកល្បងភ្លាមៗ (Demo Guest)',
    demoGuestDesc: 'ចូលទស្សនាភ្លាមៗជាមួយវីដេអូ និងរូបថតគំរូ',
    popoutDrive: 'បើកផ្ទាំងពេញក្នុង Google Drive',
    connectedDriveStorage: 'បានភ្ជាប់៖ phonphaihdvk@gmail.com • ទំហំផ្ទុក 5 TB Google Drive',
  },
};

const INITIAL_DEMO_VIDEOS: DriveVideoFile[] = [
  {
    id: 'demo_1',
    name: 'Cloud Demo Video - Big Buck Bunny HD',
    size: '15.8 MB',
    date: 'Oct 12, 2026',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailLink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    category: 'Work Videos',
    fav: true,
    type: 'video',
  },
  {
    id: 'demo_2',
    name: 'Family Memories Video - For Bigger Blazes',
    size: '84.9 MB',
    date: 'Oct 20, 2026',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailLink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    category: 'Travel Recordings',
    fav: true,
    type: 'video',
  },
  {
    id: 'demo_ts_1',
    name: 'Broadcast_Live_Stream_HD_Capture.ts',
    size: '128.4 MB',
    date: 'Oct 25, 2026',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailLink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    category: 'Work Videos',
    fav: true,
    type: 'video',
    isTSFile: true,
  },
  {
    id: 'demo_3',
    name: 'Elephants Dream Open Movie 4K',
    size: '42.3 MB',
    date: 'Oct 22, 2026',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailLink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    category: 'Tutorials & Tech',
    fav: false,
    type: 'video',
  },
  {
    id: 'demo_4',
    name: 'Tears of Steel Sci-Fi Trailer FHD',
    size: '65.1 MB',
    date: 'Oct 24, 2026',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailLink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    category: 'Entertainment',
    fav: false,
    type: 'video',
  },
];

const INITIAL_DEMO_PHOTOS: DriveVideoFile[] = [
  {
    id: 'photo_1',
    name: 'Angkor Wat Temple Sunrise Panorama.jpg',
    size: '4.8 MB',
    date: 'Oct 24, 2026',
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&auto=format&fit=crop&q=85',
    previewUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&auto=format&fit=crop&q=85',
    directUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&auto=format&fit=crop&q=85',
    category: 'Travel & Trips',
    fav: true,
    type: 'image',
  },
  {
    id: 'photo_2',
    name: 'Koh Rong Island Turquoise Waves.jpg',
    size: '6.2 MB',
    date: 'Oct 23, 2026',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85',
    directUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85',
    category: 'Travel & Trips',
    fav: false,
    type: 'image',
  },
  {
    id: 'photo_3',
    name: 'Phnom Penh Riverside Twilight Skyline.jpg',
    size: '5.1 MB',
    date: 'Oct 21, 2026',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&auto=format&fit=crop&q=85',
    previewUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&auto=format&fit=crop&q=85',
    directUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&auto=format&fit=crop&q=85',
    category: 'Wallpapers & Art',
    fav: true,
    type: 'image',
  },
  {
    id: 'photo_4',
    name: 'Bokor National Park Mountain Mist.jpg',
    size: '3.9 MB',
    date: 'Oct 19, 2026',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=85',
    previewUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=85',
    directUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=85',
    category: 'Family & Memories',
    fav: false,
    type: 'image',
  },
];

// Clean Video & Photo Thumbnail Cover Component (Eliminates broken [?] boxes completely)
const MediaThumbnailCover: React.FC<{ item: DriveVideoFile; accent?: string }> = ({
  item,
  accent = '#0ea5e9',
}) => {
  const [imgError, setImgError] = useState(false);
  const [generatedThumb, setGeneratedThumb] = useState<string>('');

  const isVideo = item.type !== 'image';
  const rawCover = item.thumbnailLink || item.previewUrl;
  const isVideoFileUrl = rawCover && (rawCover.endsWith('.mp4') || rawCover.includes('/preview'));
  const validImageUrl = !isVideoFileUrl && !imgError && rawCover ? rawCover : null;

  useEffect(() => {
    if (isVideo && !validImageUrl && !generatedThumb && (item.url || item.directUrl)) {
      const srcToTry = item.directUrl || item.url;
      if (srcToTry && (srcToTry.startsWith('blob:') || srcToTry.startsWith('http'))) {
        generateVideoThumbnail(srcToTry)
          .then((thumb) => {
            if (thumb) setGeneratedThumb(thumb);
          })
          .catch(() => {});
      }
    }
  }, [isVideo, validImageUrl, generatedThumb, item.url, item.directUrl]);

  const activeSrc = validImageUrl || generatedThumb;

  if (activeSrc) {
    return (
      <div className="w-full h-full relative group">
        <img
          src={activeSrc}
          alt={item.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isVideo && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <svg className="w-4 h-4 fill-current text-white translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback high-definition poster cover when thumbnailLink is generating or pending
  return (
    <div
      style={{
        background: `radial-gradient(circle at 50% 40%, ${accent}25, #090e17 80%)`,
      }}
      className="w-full h-full flex flex-col items-center justify-center p-3 relative overflow-hidden select-none group"
    >
      <div
        style={{ borderColor: `${accent}40`, backgroundColor: `${accent}15` }}
        className="w-11 h-11 rounded-2xl border flex items-center justify-center text-white shadow-inner mb-1.5 group-hover:scale-110 transition-transform"
      >
        {isVideo ? (
          <svg className="w-5 h-5 fill-current" style={{ color: accent }} viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 fill-none stroke-current" style={{ color: accent }} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <span className="text-[10px] font-mono font-bold text-slate-300 truncate max-w-[90%] text-center">
        {isVideo ? (item.isTSFile ? 'MPEG-TS HD' : 'HD VIDEO') : 'PHOTO'}
      </span>
      <span className="text-[9px] text-slate-400 font-mono mt-0.5">
        {item.size}
      </span>
    </div>
  );
};

const DEFAULT_VIDEO_FOLDERS = [
  'Work Videos',
  'Travel Recordings',
  'Tutorials & Tech',
  'Entertainment',
];

const DEFAULT_PHOTO_FOLDERS = [
  'Travel & Trips',
  'Family & Memories',
  'Wallpapers & Art',
  'Event Photos',
];

export const ACCENT_COLORS = [
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Neon Cyan', hex: '#06b6d4' },
  { name: 'Magenta', hex: '#d946ef' },
  { name: 'Lime Glow', hex: '#84cc16' },
  { name: 'Orange Flame', hex: '#f97316' },
  { name: 'Royal Indigo', hex: '#6366f1' },
];

export type ThemeStyle = 'slate' | 'black' | 'aurora' | 'sunset' | 'cyber' | 'midnight';

export interface VaultUser {
  email: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  role: 'admin' | 'user';
  date: string;
}

const DEFAULT_USERS: VaultUser[] = [
  {
    email: 'phonphaihdvk@gmail.com',
    name: 'Phon Phal (Developer / Super Admin)',
    status: 'approved',
    role: 'admin',
    date: 'Oct 25, 2026',
  },
  {
    email: 'cloud.media@gmail.com',
    name: 'Cloud Media Explorer',
    status: 'approved',
    role: 'user',
    date: 'Oct 25, 2026',
  },
  {
    email: 'guest.mobile@gmail.com',
    name: 'Mobile Android Guest',
    status: 'pending',
    role: 'user',
    date: 'Oct 25, 2026',
  },
];

const DEVELOPER_ADMIN_EMAIL = 'phonphaihdvk@gmail.com';

export default function App() {
  // Bilingual Language State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('vault_lang') as Language) || 'km';
  });
  const t = TRANSLATIONS[lang];

  // Theme & Style States
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const [accent, setAccent] = useState<string>(() => {
    return localStorage.getItem('accent_color') || '#0284c7';
  });
  const [bgStyle, setBgStyle] = useState<ThemeStyle>(() => {
    return (localStorage.getItem('bg_style') as ThemeStyle) || 'slate';
  });
  const [menu, setMenu] = useState(false);

  // Authentication & Landing Page States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vault_auth_active') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('vault_user_email') || '';
  });
  const [user, setUser] = useState<VaultUserSession | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Landing login form state
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginPinInput, setLoginPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Camera QR Scanner State
  const [showCameraQRScanner, setShowCameraQRScanner] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Strict Separation: Video Vault & Photo Vault Folder-First Hierarchy States
  const [tab, setTab] = useState<'videos' | 'photos' | 'all' | 'favorites'>('videos');
  const [selectedFolder, setSelectedFolder] = useState<{ name: string; type: 'video' | 'photo' } | null>(null);
  const [nestedMediaType, setNestedMediaType] = useState<'all' | 'videos' | 'photos'>('all');

  // Dedicated Developer Admin Panel Modal State
  const [showDevAdminModal, setShowDevAdminModal] = useState(false);

  // Developer Google OAuth / API Configuration Modal States (for Netlify & Custom Domains)
  const [showApiConfigModal, setShowApiConfigModal] = useState(false);
  const [customClientIdInput, setCustomClientIdInput] = useState(() => getGoogleClientId());
  const [customApiKeyInput, setCustomApiKeyInput] = useState(() => getGoogleApiKey());
  const [apiConfigSuccess, setApiConfigSuccess] = useState('');

  // Dynamic Video Aspect Ratio & Real Resolution States
  const [videoDimensions, setVideoDimensions] = useState<{
    width: number;
    height: number;
    isPortrait: boolean;
  } | null>(null);

  // Separated Video and Photo Folders
  const [videoCategories, setVideoCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('vault_video_folders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_VIDEO_FOLDERS;
  });

  const [photoCategories, setPhotoCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('vault_photo_folders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_PHOTO_FOLDERS;
  });

  // Folder Modal state
  const [folderModal, setFolderModal] = useState<{
    open: boolean;
    folderType: 'video' | 'photo';
    mode: 'add' | 'edit';
    oldName: string;
    name: string;
  }>({
    open: false,
    folderType: 'video',
    mode: 'add',
    oldName: '',
    name: '',
  });

  const [folderToDelete, setFolderToDelete] = useState<{ name: string; folderType: 'video' | 'photo' } | null>(null);
  const [activeFolderMenu, setActiveFolderMenu] = useState<{ name: string; folderType: 'video' | 'photo' } | null>(null);
  const [blockedFolderDelete, setBlockedFolderDelete] = useState<{ name: string; folderType: 'video' | 'photo'; count: number } | null>(null);

  // Google Drive Real Permanent Deletion States
  const [fileToDelete, setFileToDelete] = useState<DriveVideoFile | null>(null);
  const [isDeletingDriveFile, setIsDeletingDriveFile] = useState(false);

  // 3-Dots Action Menu on Media Items
  const [activeActionItem, setActiveActionItem] = useState<DriveVideoFile | null>(null);
  const [showRenameMediaModal, setShowRenameMediaModal] = useState(false);
  const [renameMediaInput, setRenameMediaInput] = useState('');
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);

  // Developer User Approvals State (Admin: Phon Phal)
  const [vaultUsers, setVaultUsers] = useState<VaultUser[]>(() => {
    const saved = localStorage.getItem('vault_users_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_USERS;
  });
  const [requireDeveloperApproval, setRequireDeveloperApproval] = useState<boolean>(() => {
    return localStorage.getItem('vault_require_approval') !== 'false';
  });
  const [newPreapproveEmail, setNewPreapproveEmail] = useState('');

  // Media Library
  const [mediaItems, setMediaItems] = useState<DriveVideoFile[]>(() => {
    const savedUserEmail = localStorage.getItem('vault_user_email') || 'phonphaihdvk@gmail.com';
    const cached = getDriveCache(savedUserEmail);
    if (cached && cached.length > 0) return cached;
    return [...INITIAL_DEMO_VIDEOS, ...INITIAL_DEMO_PHOTOS];
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [needsScopeConsent, setNeedsScopeConsent] = useState(false);

  // Clean Pure Custom Video Player States (Direct HTML5 Stream, Zero Drive iframes)
  const [playVideo, setPlayVideo] = useState<DriveVideoFile | null>(null);
  const [activeStreamUrl, setActiveStreamUrl] = useState<string>('');
  const [videoStreamLoading, setVideoStreamLoading] = useState(false);
  const [videoStreamProgress, setVideoStreamProgress] = useState<{ loadedMB: string; percent: number }>({
    loadedMB: '0.0',
    percent: 0,
  });
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [useDriveStreamFallback, setUseDriveStreamFallback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'auto' | '1080p' | '720p' | '480p' | '360p'>('auto');

  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Lightbox Modal
  const [previewPhoto, setPreviewPhoto] = useState<DriveVideoFile | null>(null);

  // Profile (PP) Modal & Security PIN States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinError, setChangePinError] = useState('');

  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return localStorage.getItem('vault_user_avatar') || '';
  });
  const [pinCode, setPinCode] = useState<string>(() => {
    return localStorage.getItem('vault_pin_code') || '';
  });
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Real-time Upload Progress Modal States (XMLHttpRequest)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressInfo>({
    percent: 0,
    loadedBytes: 0,
    totalBytes: 0,
    loadedMB: '0.0',
    totalMB: '0.0',
  });
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState<'video' | 'image'>('video');
  const [uploadIsTS, setUploadIsTS] = useState(false);
  const uploadControllerRef = useRef<UploadController | null>(null);

  // Dedicated Upload Modal & File Inputs
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Target Folder Selection Modal States
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [pendingUploadType, setPendingUploadType] = useState<'video' | 'photo'>('video');
  const [targetFolderSelection, setTargetFolderSelection] = useState<string>('');
  const [showTargetFolderModal, setShowTargetFolderModal] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');
  const [showNewFolderInline, setShowNewFolderInline] = useState(false);

  // Folder Locks State (4-Digit PIN & Birthday Security Recovery)
  const [folderLocks, setFolderLocks] = useState<Record<string, { pin: string; dob: string; isLocked: boolean; lockedAt?: string }>>(() => {
    try {
      const saved = localStorage.getItem('vault_folder_locks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveFolderLocks = (newLocks: Record<string, { pin: string; dob: string; isLocked: boolean; lockedAt?: string }>) => {
    setFolderLocks(newLocks);
    try {
      localStorage.setItem('vault_folder_locks', JSON.stringify(newLocks));
    } catch (e) {
      console.warn('Failed to save folder locks:', e);
    }
  };

  // Set Folder Lock Modal State
  const [showSetFolderLockModal, setShowSetFolderLockModal] = useState<{
    name: string;
    folderType: 'video' | 'photo';
  } | null>(null);
  const [lockPinInput, setLockPinInput] = useState('');
  const [lockDobInput, setLockDobInput] = useState('');
  const [lockModalError, setLockModalError] = useState('');

  // Unlock Folder Modal State
  const [unlockFolderModal, setUnlockFolderModal] = useState<{
    name: string;
    folderType: 'video' | 'photo';
    isRemovingLock?: boolean;
  } | null>(null);
  const [unlockPinInput, setUnlockPinInput] = useState('');
  const [unlockDobInput, setUnlockDobInput] = useState('');
  const [isForgotPinMode, setIsForgotPinMode] = useState(false);
  const [unlockModalError, setUnlockModalError] = useState('');

  // Persist language
  useEffect(() => {
    localStorage.setItem('vault_lang', lang);
  }, [lang]);

  // Persist folders
  useEffect(() => {
    localStorage.setItem('vault_video_folders', JSON.stringify(videoCategories));
  }, [videoCategories]);

  useEffect(() => {
    localStorage.setItem('vault_photo_folders', JSON.stringify(photoCategories));
  }, [photoCategories]);

  // Persist approvals
  useEffect(() => {
    localStorage.setItem('vault_users_list', JSON.stringify(vaultUsers));
  }, [vaultUsers]);

  useEffect(() => {
    localStorage.setItem('vault_require_approval', requireDeveloperApproval ? 'true' : 'false');
  }, [requireDeveloperApproval]);

  // Sync theme
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('accent_color', accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem('bg_style', bgStyle);
  }, [bgStyle]);

  // Cross-platform mobile & desktop fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as any;
      const isFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);

    const video = videoPlayerRef.current;
    const onIOSBegin = () => setIsFullscreen(true);
    const onIOSEnd = () => setIsFullscreen(false);

    if (video) {
      video.addEventListener('webkitbeginfullscreen', onIOSBegin);
      video.addEventListener('webkitendfullscreen', onIOSEnd);
    }

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('mozfullscreenchange', onFullscreenChange);
      document.removeEventListener('MSFullscreenChange', onFullscreenChange);
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', onIOSBegin);
        video.removeEventListener('webkitendfullscreen', onIOSEnd);
      }
    };
  }, [playVideo]);

  // Dismiss Quality Menu on outside click or Escape key
  useEffect(() => {
    if (!showQualityMenu) return;
    const handleOutsideClick = () => setShowQualityMenu(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowQualityMenu(false);
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showQualityMenu]);

  // Google / Vault auth state restore on app startup (Direct GIS, Zero Firebase dependencies)
  useEffect(() => {
    const isActive = localStorage.getItem('vault_auth_active') === 'true';
    const email = localStorage.getItem('vault_user_email') || '';
    const storedToken = localStorage.getItem('vault_access_token');
    const storedName = localStorage.getItem('vault_user_name') || (email ? email.split('@')[0] : 'Vault User');
    const storedAvatar = localStorage.getItem('vault_user_avatar') || '';

    if (isActive && email) {
      const restoredUser: VaultUserSession = {
        email,
        displayName: storedName,
        name: storedName,
        photoURL: storedAvatar,
        picture: storedAvatar,
      };
      setUser(restoredUser);
      setUserEmail(email);
      setIsAuthenticated(true);
      if (storedToken) {
        setAccessToken(storedToken);
        setAccessTokenInMemory(storedToken);
      }
      const cached = getDriveCache(email);
      if (cached && cached.length > 0) {
        setMediaItems(cached);
      }
      if (storedToken) {
        loadDriveVideos(storedToken, email).catch(() => {});
      }
    }
  }, []);

  // HTML5 Video Player listeners & volume sync
  useEffect(() => {
    const video = videoPlayerRef.current;
    if (!video || !playVideo) return;

    setUseIframeFallback(false);
    video.volume = volume;
    video.muted = isMuted;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      console.warn('Direct HTML5 video stream playback notice - activating Drive stream fallback for unsupported format');
      if (!playVideo?.id.startsWith('demo_') && !playVideo?.id.startsWith('local_')) {
        setUseDriveStreamFallback(true);
        setVideoStreamLoading(false);
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
    };
  }, [playVideo, activeStreamUrl]);

  // Cross-Platform Fullscreen API Toggle (requestFullscreen on Desktop/Android + webkitEnterFullscreen on iOS Safari)
  const toggleFullscreen = async () => {
    const container = playerContainerRef.current;
    const video = videoPlayerRef.current;

    const doc = document as any;
    const isFull = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      (video as any)?.webkitDisplayingFullscreen
    );

    // 1. Mobile iOS Safari: Use native HTMLVideoElement webkitEnterFullscreen / webkitExitFullscreen
    const isIOS =
      typeof navigator !== 'undefined' &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    if (isIOS && video && (video as any).webkitEnterFullscreen) {
      try {
        if ((video as any).webkitDisplayingFullscreen) {
          (video as any).webkitExitFullscreen?.();
          setIsFullscreen(false);
        } else {
          (video as any).webkitEnterFullscreen();
          setIsFullscreen(true);
        }
        return;
      } catch (err) {
        console.warn('iOS webkitEnterFullscreen fallback error:', err);
      }
    }

    // 2. Standard Cross-Platform Fullscreen API
    if (!isFull) {
      try {
        if (container?.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any)?.webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen();
        } else if ((container as any)?.mozRequestFullScreen) {
          (container as any).mozRequestFullScreen();
        } else if ((container as any)?.msRequestFullscreen) {
          (container as any).msRequestFullscreen();
        } else if (video && (video as any).webkitEnterFullscreen) {
          (video as any).webkitEnterFullscreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        if (video && (video as any).webkitEnterFullscreen) {
          try {
            (video as any).webkitEnterFullscreen();
            setIsFullscreen(true);
          } catch {}
        }
      }
    } else {
      try {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        } else if (video && (video as any).webkitExitFullscreen) {
          (video as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (err) {
        setIsFullscreen(false);
      }
    }
  };

  // Camera QR Code Scanner logic
  const startCameraScan = async () => {
    setIsCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        cameraStreamRef.current = stream;
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
          cameraVideoRef.current.play().catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Camera access error or restricted iframe:', err);
    }
  };

  const stopCameraScan = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleSimulateQRScanLogin = (scannedEmail = 'phonphaihdvk@gmail.com') => {
    stopCameraScan();
    setShowCameraQRScanner(false);
    setIsAuthenticated(true);
    setUserEmail(scannedEmail);
    localStorage.setItem('vault_auth_active', 'true');
    localStorage.setItem('vault_user_email', scannedEmail);
    setStatusMessage(`Logged in via Camera QR Scan: ${scannedEmail}`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleApiConfig(customClientIdInput, customApiKeyInput);
    setApiConfigSuccess(t.credentialsSaved || 'Credentials saved successfully!');
    setTimeout(() => {
      setApiConfigSuccess('');
      setShowApiConfigModal(false);
    }, 1200);
  };

  // Google Sign In handler (Direct Google Identity Services - GIS, Zero Firebase dependencies)
  const handleGoogleSignIn = async (forceConsent = false) => {
    setLoading(true);
    setStatusMessage(t.syncingDrive);
    setLoginError('');

    try {
      const gisResult = await signInWithGIS(forceConsent ? 'consent' : 'select_account');
      if (gisResult) {
        const email = gisResult.user.email || 'user@gmail.com';
        setUser(gisResult.user);
        setUserEmail(email);
        setAccessToken(gisResult.accessToken);
        setAccessTokenInMemory(gisResult.accessToken);
        setIsAuthenticated(true);
        localStorage.setItem('vault_auth_active', 'true');
        localStorage.setItem('vault_user_email', email);
        if (gisResult.user.displayName) {
          localStorage.setItem('vault_user_name', gisResult.user.displayName);
        }
        if (gisResult.user.photoURL) {
          setUserAvatar(gisResult.user.photoURL);
          localStorage.setItem('vault_user_avatar', gisResult.user.photoURL);
        }

        // Register in user list
        const currentEmail = email.toLowerCase();
        setVaultUsers((prev) => {
          const exists = prev.some((u) => u.email.toLowerCase() === currentEmail);
          if (!exists) {
            const isDev = currentEmail === DEVELOPER_ADMIN_EMAIL.toLowerCase();
            return [
              ...prev,
              {
                email: email,
                name: gisResult.user.displayName || 'Google User',
                status: isDev ? 'approved' : 'pending',
                role: isDev ? 'admin' : 'user',
                date: 'Just now',
              },
            ];
          }
          return prev;
        });

        await loadDriveVideos(gisResult.accessToken, email);
        setStatusMessage(t.cloudConnected);
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err: any) {
      console.warn('Google Identity Services login error:', err);
      if (err?.message === 'MISSING_CLIENT_ID') {
        setShowApiConfigModal(true);
        setLoginError('Please configure your Google Client ID for direct Google OAuth on Netlify.');
      } else if (err?.message?.includes('popup_closed') || err?.message?.includes('closed')) {
        // user closed popup
      } else {
        setLoginError(err?.message || 'Google Sign-in was cancelled or encountered an error.');
        setTimeout(() => setLoginError(''), 6000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual Gmail + Custom PIN Login / Sign-up Handler
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmailInput.trim().toLowerCase();
    const pin = loginPinInput.trim();

    if (!email || !email.includes('@')) {
      setLoginError('Please enter a valid Gmail address.');
      return;
    }
    if (pin.length !== 4) {
      setLoginError('PIN must be exactly 4 digits.');
      return;
    }

    // Set PIN on first sign-up or verify
    const storedPin = localStorage.getItem('vault_pin_code');
    if (!storedPin) {
      setPinCode(pin);
      localStorage.setItem('vault_pin_code', pin);
    } else if (storedPin !== pin) {
      setLoginError('Incorrect PIN code.');
      return;
    }

    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('vault_auth_active', 'true');
    localStorage.setItem('vault_user_email', email);
    setLoginError('');

    // Register user under Developer Approval
    setVaultUsers((prev) => {
      const exists = prev.some((u) => u.email.toLowerCase() === email);
      if (!exists) {
        const isDev = email === DEVELOPER_ADMIN_EMAIL.toLowerCase();
        return [
          ...prev,
          {
            email: email,
            name: email.split('@')[0],
            status: isDev ? 'approved' : 'pending',
            role: isDev ? 'admin' : 'user',
            date: 'Just now',
          },
        ];
      }
      return prev;
    });

    const cached = getDriveCache(email);
    if (cached && cached.length > 0) {
      setMediaItems(cached);
    }
  };

  // Complete Sign Out: exits completely to the Landing Login Page
  const handleSignOutComplete = async () => {
    stopCameraScan();
    await googleSignOut();
    setUser(null);
    setUserEmail('');
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vault_auth_active');
    setNeedsScopeConsent(false);
    setShowProfileModal(false);
    setMenu(false);
    setSelectedFolder(null);
    setTab('videos');
    setMediaItems([...INITIAL_DEMO_VIDEOS, ...INITIAL_DEMO_PHOTOS]);
    setStatusMessage('Signed out completely.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Fetch Drive media using token & persist to cross-device cache
  const loadDriveVideos = async (token?: string, emailArg?: string) => {
    const activeToken = token || accessToken;
    if (!activeToken) return;

    setLoading(true);
    setNeedsScopeConsent(false);
    try {
      const result = await fetchDriveVideos(activeToken);
      if (result.success && result.files.length > 0) {
        setMediaItems(result.files);
        setNeedsScopeConsent(false);
        const email = emailArg || userEmail || user?.email || '';
        if (email) {
          saveDriveCache(email, result.files);
        }
      } else if (result.insufficientScopes) {
        setNeedsScopeConsent(true);
        setStatusMessage('Google Drive read permission needed to view cloud files.');
      } else {
        if (result.files.length === 0) {
          setStatusMessage('Cloud Drive connected! No uploaded media in storage yet.');
          setTimeout(() => setStatusMessage(''), 4000);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load drive files:', err);
    } finally {
      setLoading(false);
    }
  };

  // Intercept file selection to open "Select Target Folder" modal
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
    const mediaType: 'video' | 'photo' = isImage ? 'photo' : 'video';
    const relevantFolders = isImage ? photoCategories : videoCategories;
    const defaultFolder =
      selectedFolder && selectedFolder.type === mediaType
        ? selectedFolder.name
        : relevantFolders[0] || (isImage ? 'Travel & Trips' : 'Work Videos');

    setPendingUploadFile(file);
    setPendingUploadType(mediaType);
    setTargetFolderSelection(defaultFolder);
    setShowNewFolderInline(false);
    setNewFolderNameInput('');
    setShowTargetFolderModal(true);

    if (fileRef.current) fileRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleConfirmTargetFolderUpload = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingUploadFile) return;

    let targetFolder = targetFolderSelection;
    if (showNewFolderInline && newFolderNameInput.trim()) {
      const cleanName = newFolderNameInput.trim();
      if (pendingUploadType === 'video') {
        if (!videoCategories.includes(cleanName)) {
          setVideoCategories([...videoCategories, cleanName]);
        }
      } else {
        if (!photoCategories.includes(cleanName)) {
          setPhotoCategories([...photoCategories, cleanName]);
        }
      }
      targetFolder = cleanName;
    }

    const fileToUpload = pendingUploadFile;
    setShowTargetFolderModal(false);
    setPendingUploadFile(null);
    executeFileUpload(fileToUpload, targetFolder);
  };

  // Real-time Upload executor with Google Drive cross-device folder metadata sync
  const executeFileUpload = (file: File, targetCategory: string) => {
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
    const isTS = file.name.toLowerCase().endsWith('.ts');

    setUploadFileName(file.name);
    setUploadFileType(isImage ? 'image' : 'video');
    setUploadIsTS(isTS);
    setIsUploading(true);
    setUploadProgress({
      percent: 0,
      loadedBytes: 0,
      totalBytes: file.size,
      loadedMB: '0.0',
      totalMB: (file.size / (1024 * 1024)).toFixed(1),
    });

    if (user && accessToken) {
      const controller = uploadMediaToDriveXHR(
        file,
        accessToken,
        targetCategory,
        (progress) => setUploadProgress(progress),
        (uploadedFile) => {
          setIsUploading(false);
          const finalFile: DriveVideoFile = {
            ...uploadedFile,
            category: targetCategory,
          };
          if (!isImage) {
            generateVideoThumbnail(file).then((thumb) => {
              if (thumb) {
                setMediaItems((prev) => {
                  const updated = prev.map((m) =>
                    m.id === finalFile.id ? { ...m, previewUrl: thumb, thumbnailLink: thumb } : m
                  );
                  if (user.email) saveDriveCache(user.email, updated);
                  return updated;
                });
              }
            }).catch(() => {});
          }
          setMediaItems((prev) => {
            const updated = [finalFile, ...prev];
            if (user.email) saveDriveCache(user.email, updated);
            return updated;
          });
          setStatusMessage(`Uploaded "${file.name}" to Cloud in "${targetCategory}"!`);
          setTimeout(() => setStatusMessage(''), 5000);
        },
        (error) => {
          setIsUploading(false);
          setStatusMessage(`Upload failed: ${error.message}`);
          setTimeout(() => setStatusMessage(''), 5000);
        }
      );
      uploadControllerRef.current = controller;
    } else {
      const totalBytes = file.size;
      const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);
      let loaded = 0;
      const step = Math.max(totalBytes / 25, 200 * 1024);

      const interval = setInterval(() => {
        loaded += step;
        if (loaded >= totalBytes) {
          loaded = totalBytes;
          clearInterval(interval);

          const localUrl = URL.createObjectURL(file);
          if (isImage) {
            const newLocalItem: DriveVideoFile = {
              id: `local_${Date.now()}`,
              name: file.name,
              size: totalMB + ' MB',
              sizeBytes: file.size,
              date: 'Just now',
              url: localUrl,
              previewUrl: localUrl,
              directUrl: localUrl,
              thumbnailLink: localUrl,
              category: targetCategory,
              fav: false,
              type: 'image',
            };

            setTimeout(() => {
              setIsUploading(false);
              setMediaItems((prev) => [newLocalItem, ...prev]);
              setStatusMessage(`Uploaded "${file.name}" into "${targetCategory}". Connect Cloud to sync!`);
              setTimeout(() => setStatusMessage(''), 5000);
            }, 300);
          } else {
            generateVideoThumbnail(file).then((thumb) => {
              const newLocalItem: DriveVideoFile = {
                id: `local_${Date.now()}`,
                name: file.name,
                size: totalMB + ' MB',
                sizeBytes: file.size,
                date: 'Just now',
                url: localUrl,
                previewUrl: thumb || '',
                directUrl: localUrl,
                thumbnailLink: thumb || undefined,
                category: targetCategory,
                fav: false,
                type: 'video',
                isTSFile: isTS,
              };
              setIsUploading(false);
              setMediaItems((prev) => [newLocalItem, ...prev]);
              setStatusMessage(`Uploaded "${file.name}" into "${targetCategory}". Connect Cloud to sync!`);
              setTimeout(() => setStatusMessage(''), 5000);
            }).catch(() => {
              const newLocalItem: DriveVideoFile = {
                id: `local_${Date.now()}`,
                name: file.name,
                size: totalMB + ' MB',
                sizeBytes: file.size,
                date: 'Just now',
                url: localUrl,
                previewUrl: '',
                directUrl: localUrl,
                category: targetCategory,
                fav: false,
                type: 'video',
                isTSFile: isTS,
              };
              setIsUploading(false);
              setMediaItems((prev) => [newLocalItem, ...prev]);
              setStatusMessage(`Uploaded "${file.name}" into "${targetCategory}". Connect Cloud to sync!`);
              setTimeout(() => setStatusMessage(''), 5000);
            });
          }
        }

        const percent = Math.min(100, Math.round((loaded / totalBytes) * 100));
        const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
        setUploadProgress({
          percent,
          loadedBytes: loaded,
          totalBytes,
          loadedMB,
          totalMB,
        });
      }, 70);

      uploadControllerRef.current = {
        abort: () => {
          clearInterval(interval);
          setIsUploading(false);
          setStatusMessage('Upload cancelled.');
          setTimeout(() => setStatusMessage(''), 3000);
        },
      };
    }
  };

  const handleCancelUpload = () => {
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort();
    }
    setIsUploading(false);
  };

  // Folder Opening with PIN / Security Lock Check
  const handleOpenFolder = (name: string, folderType: 'video' | 'photo') => {
    const key = `${folderType}_${name}`;
    if (folderLocks[key]?.isLocked) {
      setUnlockFolderModal({
        name,
        folderType,
        isRemovingLock: false,
      });
      setUnlockPinInput('');
      setUnlockDobInput('');
      setIsForgotPinMode(false);
      setUnlockModalError('');
      return;
    }
    setSelectedFolder({ name, type: folderType });
    setNestedMediaType(folderType === 'video' ? 'videos' : 'photos');
  };

  const handleSaveSetFolderLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSetFolderLockModal) return;
    if (lockPinInput.length !== 4 || !/^\d{4}$/.test(lockPinInput)) {
      setLockModalError(lang === 'km' ? 'សូមបញ្ចូលលេខកូដសម្ងាត់ ៤ ខ្ទង់ឱ្យបានត្រឹមត្រូវ។' : 'Please enter a valid 4-digit PIN.');
      return;
    }
    if (!lockDobInput.trim()) {
      setLockModalError(lang === 'km' ? 'សូមជ្រើសរើសថ្ងៃខែឆ្នាំកំណើតសម្រាប់ការសង្គ្រោះ។' : 'Please select your Date of Birth for security recovery.');
      return;
    }

    const key = `${showSetFolderLockModal.folderType}_${showSetFolderLockModal.name}`;
    saveFolderLocks({
      ...folderLocks,
      [key]: {
        pin: lockPinInput,
        dob: lockDobInput.trim(),
        isLocked: true,
        lockedAt: new Date().toISOString(),
      },
    });

    setStatusMessage(t.folderLockedSuccess || `Folder "${showSetFolderLockModal.name}" is now locked.`);
    setTimeout(() => setStatusMessage(''), 4000);
    setShowSetFolderLockModal(null);
    setLockPinInput('');
    setLockDobInput('');
    setLockModalError('');
  };

  const handleVerifyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockFolderModal) return;
    const key = `${unlockFolderModal.folderType}_${unlockFolderModal.name}`;
    const lockData = folderLocks[key];

    if (!lockData) {
      setSelectedFolder({ name: unlockFolderModal.name, type: unlockFolderModal.folderType });
      setNestedMediaType(unlockFolderModal.folderType === 'video' ? 'videos' : 'photos');
      setUnlockFolderModal(null);
      return;
    }

    if (isForgotPinMode) {
      if (!unlockDobInput.trim() || unlockDobInput.trim() !== lockData.dob) {
        setUnlockModalError(t.incorrectDob);
        return;
      }
    } else {
      if (unlockPinInput.trim() !== lockData.pin) {
        setUnlockModalError(t.incorrectPin);
        return;
      }
    }

    // Correct PIN or Birthday!
    if (unlockFolderModal.isRemovingLock) {
      const updatedLocks = { ...folderLocks };
      delete updatedLocks[key];
      saveFolderLocks(updatedLocks);
      setStatusMessage(lang === 'km' ? `បានដោះសោថត "${unlockFolderModal.name}" រួចរាល់!` : `Lock removed from folder "${unlockFolderModal.name}".`);
      setTimeout(() => setStatusMessage(''), 4000);
    } else {
      setSelectedFolder({ name: unlockFolderModal.name, type: unlockFolderModal.folderType });
      setNestedMediaType(unlockFolderModal.folderType === 'video' ? 'videos' : 'photos');
      setStatusMessage(t.folderUnlockedSuccess || `Folder "${unlockFolderModal.name}" opened!`);
      setTimeout(() => setStatusMessage(''), 3000);
    }

    setUnlockFolderModal(null);
    setUnlockPinInput('');
    setUnlockDobInput('');
    setIsForgotPinMode(false);
    setUnlockModalError('');
  };

  // Folder Management Handlers (Separated for Videos and Photos)
  const handleSaveFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = folderModal.name.trim();
    if (!cleanName) return;

    const isVideo = folderModal.folderType === 'video';
    const currentList = isVideo ? videoCategories : photoCategories;
    const setList = isVideo ? setVideoCategories : setPhotoCategories;

    if (folderModal.mode === 'add') {
      if (currentList.includes(cleanName)) {
        setStatusMessage('A folder with this name already exists.');
        setTimeout(() => setStatusMessage(''), 4000);
        return;
      }
      setList([...currentList, cleanName]);
      setStatusMessage(`Folder "${cleanName}" created!`);
    } else {
      const oldName = folderModal.oldName;
      if (oldName === cleanName) {
        setFolderModal({ open: false, folderType: 'video', mode: 'add', oldName: '', name: '' });
        return;
      }
      setList(currentList.map((c) => (c === oldName ? cleanName : c)));
      setMediaItems((prev) => {
        const updated = prev.map((item) => (item.category === oldName ? { ...item, category: cleanName } : item));
        if (userEmail) saveDriveCache(userEmail, updated);
        return updated;
      });
      if (selectedFolder && selectedFolder.name === oldName) {
        setSelectedFolder({ name: cleanName, type: selectedFolder.type });
      }

      // Transfer folder lock key if exists
      const oldKey = `${folderModal.folderType}_${oldName}`;
      if (folderLocks[oldKey]) {
        const lockObj = folderLocks[oldKey];
        const updatedLocks = { ...folderLocks };
        delete updatedLocks[oldKey];
        updatedLocks[`${folderModal.folderType}_${cleanName}`] = lockObj;
        saveFolderLocks(updatedLocks);
      }

      setStatusMessage(`Folder renamed to "${cleanName}"!`);
    }

    setFolderModal({ open: false, folderType: 'video', mode: 'add', oldName: '', name: '' });
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleDeleteFolder = (folderName: string, folderType: 'video' | 'photo') => {
    const isVideo = folderType === 'video';
    const currentList = isVideo ? videoCategories : photoCategories;
    const setList = isVideo ? setVideoCategories : setPhotoCategories;

    // Double check that folder is empty before removing
    const count = mediaItems.filter((m) => m.category === folderName).length;
    if (count > 0) {
      setFolderToDelete(null);
      setBlockedFolderDelete({
        name: folderName,
        folderType,
        count,
      });
      return;
    }

    const remaining = currentList.filter((c) => c !== folderName);
    setList(remaining);

    // Remove lock data if exists
    const lockKey = `${folderType}_${folderName}`;
    if (folderLocks[lockKey]) {
      const updatedLocks = { ...folderLocks };
      delete updatedLocks[lockKey];
      saveFolderLocks(updatedLocks);
    }

    if (selectedFolder && selectedFolder.name === folderName) setSelectedFolder(null);
    setFolderToDelete(null);
    setStatusMessage(`Folder "${folderName}" deleted.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // Media 3-Dots Action Handlers: Rename, Delete, Move
  const handleRenameMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionItem || !renameMediaInput.trim()) return;

    setMediaItems((prev) => {
      const updated = prev.map((item) =>
        item.id === activeActionItem.id ? { ...item, name: renameMediaInput.trim() } : item
      );
      if (userEmail) saveDriveCache(userEmail, updated);
      return updated;
    });

    if (playVideo && playVideo.id === activeActionItem.id) {
      setPlayVideo({ ...playVideo, name: renameMediaInput.trim() });
    }

    setShowRenameMediaModal(false);
    setActiveActionItem(null);
    setStatusMessage('File renamed successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Real Google Drive Permanent Deletion Handler
  const handleConfirmDeleteDriveFile = async () => {
    if (!fileToDelete) return;
    const target = fileToDelete;
    setIsDeletingDriveFile(true);

    try {
      // Execute real Drive API deletion if online and authenticated
      if (accessToken && !target.id.startsWith('demo_') && !target.id.startsWith('local_')) {
        const deleteRes = await deleteDriveFile(target.id, accessToken);
        if (!deleteRes.success) {
          console.warn('Drive DELETE API warning:', deleteRes.errorMessage);
        }
      }

      // Immediately update mediaItems and cache in real-time
      setMediaItems((prev) => {
        const updated = prev.filter((m) => m.id !== target.id);
        if (userEmail) saveDriveCache(userEmail, updated);
        return updated;
      });

      if (playVideo && playVideo.id === target.id) setPlayVideo(null);
      if (previewPhoto && previewPhoto.id === target.id) setPreviewPhoto(null);

      setStatusMessage(`"${target.name}" ${t.deleteSuccessDrive}`);
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to permanently delete from Drive:', err);
      setStatusMessage(`Delete error: ${err.message || 'Could not delete file'}`);
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setIsDeletingDriveFile(false);
      setFileToDelete(null);
    }
  };

  const handleMoveMediaFolder = (targetFolder: string) => {
    if (!activeActionItem) return;

    const itemToMove = activeActionItem;
    setMediaItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemToMove.id ? { ...item, category: targetFolder } : item
      );
      if (userEmail) saveDriveCache(userEmail, updated);
      return updated;
    });

    if (accessToken && itemToMove.id && !itemToMove.id.startsWith('local_') && !itemToMove.id.startsWith('demo_')) {
      updateDriveFileCategory(itemToMove.id, targetFolder, accessToken).catch((err) => {
        console.warn('Failed to update folder category on Google Drive:', err);
      });
    }

    setShowMoveFolderModal(false);
    setActiveActionItem(null);
    setStatusMessage(`Moved to folder "${targetFolder}"!`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Developer User Approval Actions
  const handleUpdateUserStatus = (email: string, status: 'approved' | 'rejected') => {
    setVaultUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === email.toLowerCase() ? { ...u, status } : u))
    );
    setStatusMessage(`User ${email} ${status}.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handlePreapproveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newPreapproveEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    if (vaultUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setStatusMessage('User already in approval list.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    setVaultUsers([
      ...vaultUsers,
      {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        status: 'approved',
        role: 'user',
        date: 'Today',
      },
    ]);
    setNewPreapproveEmail('');
    setStatusMessage(`Pre-approved ${cleanEmail}.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // Custom PIN Management
  const handleSaveCustomPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setChangePinError('PIN must be exactly 4 digits');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setChangePinError('Confirmation PIN does not match');
      return;
    }

    setPinCode(newPinInput);
    localStorage.setItem('vault_pin_code', newPinInput);
    setShowChangePinModal(false);
    setNewPinInput('');
    setConfirmPinInput('');
    setChangePinError('');
    setIsVaultLocked(false);
    setEnteredPin('');
    setStatusMessage('Security PIN saved successfully!');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // Lock Screen PIN verification
  const handlePinInput = (digit: string) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      setPinError('');

      if (newPin.length === 4) {
        if (newPin === pinCode || (!pinCode && newPin.length === 4)) {
          setIsVaultLocked(false);
          setEnteredPin('');
        } else {
          setPinError('Incorrect 4-digit PIN');
          setTimeout(() => setEnteredPin(''), 600);
        }
      }
    }
  };

  // Download QR Code as crisp PNG
  const handleDownloadQR = () => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, 600, 600);
          context.drawImage(image, 50, 50, 500, 500);

          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'HD-Vault-Login-QR.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(blobURL);
          setStatusMessage('QR Code downloaded as HD-Vault-Login-QR.png!');
          setTimeout(() => setStatusMessage(''), 4000);
        }
      };
      image.src = blobURL;
    } catch (e) {
      setStatusMessage('Failed to download QR image.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // Video Player Controls & Helpers
  const togglePlayPause = () => {
    if (!videoPlayerRef.current) return;
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play();
    } else {
      videoPlayerRef.current.pause();
    }
  };

  const seekRelative = (seconds: number) => {
    if (!videoPlayerRef.current) return;
    videoPlayerRef.current.currentTime = Math.max(
      0,
      Math.min(videoPlayerRef.current.duration || 0, videoPlayerRef.current.currentTime + seconds)
    );
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    const newMuted = v === 0;
    setIsMuted(newMuted);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.volume = v;
      videoPlayerRef.current.muted = newMuted;
    }
  };

  const toggleMute = () => {
    const video = videoPlayerRef.current;
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && (video.volume === 0 || volume === 0)) {
        video.volume = 0.8;
        setVolume(0.8);
      }
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = nextSpeed;
    }
  };

  // Native Fullscreen / Orientation Toggle
  const toggleNativeFullscreen = async () => {
    const container = playerContainerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen().catch(() => {});
        } else if ((videoPlayerRef.current as any)?.webkitEnterFullscreen) {
          (videoPlayerRef.current as any).webkitEnterFullscreen();
        }
        if ((screen as any).orientation?.lock) {
          await (screen as any).orientation.lock('landscape').catch(() => {});
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
        if ((screen as any).orientation?.unlock) {
          (screen as any).orientation.unlock();
        }
        setIsFullscreen(false);
      }
    } catch (e) {
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLight = !dark;

  const bgClass = isLight
    ? 'bg-slate-100 text-slate-800'
    : bgStyle === 'black'
    ? 'bg-black text-white'
    : bgStyle === 'aurora'
    ? 'bg-gradient-to-br from-[#03151b] via-[#05262c] to-[#0d1631] text-teal-50'
    : bgStyle === 'sunset'
    ? 'bg-gradient-to-br from-[#180812] via-[#240c17] to-[#120a21] text-rose-50'
    : bgStyle === 'cyber'
    ? 'bg-gradient-to-br from-[#090014] via-[#15002b] to-[#001322] text-fuchsia-50'
    : bgStyle === 'midnight'
    ? 'bg-gradient-to-br from-[#020617] via-[#081229] to-[#020617] text-sky-50'
    : 'bg-[#0b1120] text-slate-100';

  const cardClass = isLight
    ? 'bg-white border-slate-200 text-slate-800 hover:border-sky-400'
    : bgStyle === 'black'
    ? 'bg-[#121212] border-neutral-800 text-slate-200 hover:border-neutral-600'
    : bgStyle === 'aurora'
    ? 'bg-teal-950/30 border-teal-800/40 text-slate-200 hover:border-teal-400/60 backdrop-blur-xs'
    : bgStyle === 'sunset'
    ? 'bg-rose-950/25 border-rose-900/40 text-slate-200 hover:border-rose-400/60 backdrop-blur-xs'
    : bgStyle === 'cyber'
    ? 'bg-purple-950/30 border-purple-800/40 text-slate-200 hover:border-fuchsia-400/60 backdrop-blur-xs'
    : bgStyle === 'midnight'
    ? 'bg-sky-950/25 border-sky-900/40 text-slate-200 hover:border-sky-400/60 backdrop-blur-xs'
    : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-sky-500';

  // Developer Admin check (Admin: Phon Phal)
  const isDeveloperAdmin = (userEmail || '').toLowerCase() === DEVELOPER_ADMIN_EMAIL.toLowerCase();
  const currentUserRecord = vaultUsers.find((u) => u.email.toLowerCase() === (userEmail || '').toLowerCase());
  const isUserApproved = isDeveloperAdmin || !requireDeveloperApproval || currentUserRecord?.status === 'approved';

  // Media filtering
  const allVideos = mediaItems.filter((m) => m.type !== 'image');
  const allPhotos = mediaItems.filter((m) => m.type === 'image');
  const favList = mediaItems.filter((m) => m.fav);

  // Nested folder items
  const folderItems = selectedFolder
    ? mediaItems.filter((m) => m.category === selectedFolder.name)
    : [];

  const displayedNestedItems = folderItems.filter((item) => {
    if (nestedMediaType === 'videos') return item.type !== 'image';
    if (nestedMediaType === 'photos') return item.type === 'image';
    return true;
  });

  // Real-time Storage Quota Calculation dynamically reflecting 5TB Google Drive Quota
  const totalUsedBytes = mediaItems.reduce((acc, item) => {
    if (item.sizeBytes) return acc + item.sizeBytes;
    const mbMatch = (item.size || '').match(/([\d.]+)\s*MB/i);
    if (mbMatch) return acc + parseFloat(mbMatch[1]) * 1024 * 1024;
    return acc + 10 * 1024 * 1024;
  }, 0);
  const totalUsedMB = (totalUsedBytes / (1024 * 1024)).toFixed(1);
  const totalUsedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const storageLimitBytes = 5 * 1024 * 1024 * 1024 * 1024; // 5 TB Google Drive Quota
  const storageLimitDisplay = '5 TB';
  const usedStorageDisplay = parseFloat(totalUsedGB) >= 1 ? `${totalUsedGB} GB` : `${totalUsedMB} MB`;
  const storagePercent = Math.max(0.1, Math.min(100, (totalUsedBytes / storageLimitBytes) * 100));
  const storagePercentDisplay = storagePercent < 0.1 ? '< 0.1' : storagePercent.toFixed(2);

  // Active Video direct stream URL (Pure HTML5 Direct Stream)
  const activeVideoSrc = activeStreamUrl || (playVideo ? playVideo.directUrl || playVideo.url : '');

  const activeIframeSrc = playVideo
    ? playVideo.id.startsWith('demo_') || playVideo.id.startsWith('local_')
      ? playVideo.url
      : `https://drive.google.com/file/d/${playVideo.driveId || playVideo.id}/preview`
    : '';

  // Dynamic Quality Options strictly limited by actual detected native video resolution
  const availableQualities = React.useMemo(() => {
    if (!videoDimensions) {
      return [
        { id: 'auto' as const, label: t.qualityAuto, badge: 'Auto' },
      ];
    }
    // Read the video's actual native height (for portrait, minDim gives vertical line resolution)
    const nativeHeight = videoDimensions.isPortrait
      ? Math.min(videoDimensions.width, videoDimensions.height)
      : videoDimensions.height;

    const resString = `${videoDimensions.width}×${videoDimensions.height}`;
    const isPortrait = videoDimensions.isPortrait;

    const list: { id: 'auto' | '1080p' | '720p' | '480p' | '360p'; label: string; badge: string }[] = [
      {
        id: 'auto',
        label: `${t.qualityAuto} (${resString}${isPortrait ? ` • ${t.portrait}` : ''})`,
        badge: isPortrait ? `📱 ${resString}` : `🖥️ ${resString}`,
      },
    ];

    // Strictly enforce dynamic resolution limits: only show options <= native resolution
    // If video is only 720p, list only 720p HD, 480p SD, 360p, and Auto—never show 1080p or any higher tier
    if (nativeHeight >= 1080) {
      list.push({ id: '1080p', label: t.quality1080 || '1080p Full HD', badge: '1080p FHD' });
    }
    if (nativeHeight >= 720) {
      list.push({ id: '720p', label: t.quality720 || '720p HD', badge: '720p HD' });
    }
    if (nativeHeight >= 480) {
      list.push({ id: '480p', label: t.quality480 || '480p SD', badge: '480p SD' });
    }
    if (nativeHeight >= 360) {
      list.push({ id: '360p', label: t.quality360 || '360p', badge: '360p' });
    }

    return list;
  }, [videoDimensions, t]);

  // Auto-fallback to 'auto' if current quality exceeds available video resolution
  useEffect(() => {
    if (!availableQualities.some((q) => q.id === videoQuality)) {
      setVideoQuality('auto');
    }
  }, [availableQualities, videoQuality]);

  const handleOpenVideo = (video: DriveVideoFile) => {
    setPlayVideo(video);
  };

  // 1. LANDING LOGIN PAGE: Displayed when signed out
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200 ${bgClass}`}>
        <div className="max-w-md w-full space-y-6">
          {/* Top Language Toggle on Login Page */}
          <div className="flex justify-end">
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setLang('km')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  lang === 'km' ? 'bg-sky-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇰🇭</span>
                <span>ខ្មែរ</span>
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  lang === 'en' ? 'bg-sky-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>
          </div>

          {/* Logo & Vault Branding */}
          <div className="text-center space-y-2">
            <div
              style={{ backgroundColor: accent }}
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl ring-4 ring-white/10"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">{t.appName}</h1>
            <p className="text-xs text-slate-400">{t.appSubtitle} • {t.storageTier}</p>
          </div>

          {/* Authentication Card */}
          <div className={`p-6 rounded-3xl border shadow-2xl backdrop-blur-md space-y-5 ${cardClass}`}>
            {/* Primary Option: Google 1-Tap Login */}
            <div>
              <button
                onClick={() => handleGoogleSignIn(false)}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-3 shadow-md active:scale-98 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{loading ? t.syncingDrive : t.signInGoogle}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <div className="flex-1 h-px bg-slate-700/50" />
              <span>{t.signInGmailPin}</span>
              <div className="flex-1 h-px bg-slate-700/50" />
            </div>

            {/* Manual Gmail + Custom PIN Setup / Login Form */}
            <form onSubmit={handleManualLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Gmail Address</label>
                <input
                  type="email"
                  required
                  value={loginEmailInput}
                  onChange={(e) => setLoginEmailInput(e.target.value)}
                  placeholder="phonphaihdvk@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-sky-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">{t.enterPin}</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  value={loginPinInput}
                  onChange={(e) => setLoginPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white tracking-widest font-mono text-center focus:outline-hidden focus:border-sky-500 placeholder-slate-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {t.firstTimePinHint}
                </p>
              </div>

              {loginError && <p className="text-xs text-rose-400 text-center font-medium">{loginError}</p>}

              <button
                type="submit"
                style={{ backgroundColor: accent }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-98 transition cursor-pointer"
              >
                {t.appName} Login
              </button>
            </form>

            {/* Active Camera QR Scanner, One-Click Demo Guest, & Developer API Config */}
            <div className="pt-2 border-t border-slate-800/60 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCameraQRScanner(true);
                    startCameraScan();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{t.qrLogin}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticated(true);
                    setUserEmail('guest.explorer@gmail.com');
                    localStorage.setItem('vault_auth_active', 'true');
                    localStorage.setItem('vault_user_email', 'guest.explorer@gmail.com');
                    setStatusMessage(lang === 'km' ? 'បានចូលប្រើជាភ្ញៀវសាកល្បង (Guest Demo Mode) ដោយជោគជ័យ។' : 'Signed in as Demo Guest with full vault access.');
                    setTimeout(() => setStatusMessage(''), 4000);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{t.demoGuestMode}</span>
                </button>
              </div>

              {/* Developer / API Configuration for Netlify & Google OAuth */}
              <button
                type="button"
                onClick={() => setShowApiConfigModal(true)}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-700/80 hover:border-amber-400/60 bg-slate-800/40 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-amber-300 font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>{t.devApiConfig} (Google OAuth & Netlify)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE CAMERA QR CODE SCANNER MODAL */}
        {showCameraQRScanner && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => {
              stopCameraScan();
              setShowCameraQRScanner(false);
            }}
          >
            <div
              className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-center space-y-4 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs font-bold">{t.cameraScanTitle}</span>
                <button
                  onClick={() => {
                    stopCameraScan();
                    setShowCameraQRScanner(false);
                  }}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-slate-400">{t.cameraScanDesc}</p>

              {/* Camera Viewfinder with Laser Scanner Overlay */}
              <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/80 shadow-xl flex items-center justify-center">
                <video
                  ref={cameraVideoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />

                {/* Scanning Frame Corners */}
                <div className="absolute inset-4 border border-emerald-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                    <div className="w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                  </div>

                  {/* Animated Laser Beam */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg animate-pulse" />

                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                    <div className="w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>

                <div className="absolute bottom-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-emerald-400 font-mono">
                  {t.scanningCamera}
                </div>
              </div>

              {/* Instant Scan Simulation Option */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleSimulateQRScanLogin('phonphaihdvk@gmail.com')}
                  style={{ backgroundColor: accent }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow hover:opacity-90 active:scale-95 transition cursor-pointer"
                >
                  {t.simulateScan} (Phon Phal)
                </button>

                <button
                  onClick={() => {
                    stopCameraScan();
                    setShowCameraQRScanner(false);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. DEVELOPER APPROVAL GATE SCREEN: Displayed if non-approved user logs in
  if (!isUserApproved) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${bgClass}`}>
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-slate-900/90 backdrop-blur-md shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl mx-auto bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">{t.accessPending}</h2>
            <p className="text-xs text-slate-400">
              Account: <span className="text-sky-400 font-mono font-semibold">{userEmail}</span>
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              {t.pendingDesc}
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={handleSignOutComplete}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Back to Login
            </button>
            <button
              onClick={() => {
                setStatusMessage('Checking approval status...');
                setTimeout(() => setStatusMessage('Still pending developer approval. Please notify Phon Phal.'), 1000);
              }}
              style={{ backgroundColor: accent }}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white shadow hover:opacity-90 transition cursor-pointer"
            >
              Check Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD: Bilingual Header, Separated Video & Photo Folders
  return (
    <div className={`min-h-screen transition-colors duration-200 ${bgClass}`}>
      {/* Hidden File Inputs for Videos and Photos */}
      <input
        type="file"
        ref={fileRef}
        onChange={handleUploadFile}
        accept="video/*,image/*,.ts,.mkv,.mp4,.mov,.jpg,.jpeg,.png,.webp"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleUploadFile}
        accept="video/*,.ts,.mkv,.mp4,.mov,.webm"
        className="hidden"
      />
      <input
        type="file"
        ref={photoInputRef}
        onChange={handleUploadFile}
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
      />

      {/* Top Header with Language Switcher */}
      <header
        className={`flex items-center justify-between px-3 sm:px-6 py-2.5 border-b sticky top-0 z-20 backdrop-blur-md ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMenu(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors"
            title="Open Menu Drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div
            className="cursor-pointer"
            onClick={() => {
              setSelectedFolder(null);
              setTab('videos');
            }}
          >
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: accent }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs font-bold"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold leading-tight">{t.appName}</h1>
                <span className="text-[10px] text-emerald-400 font-medium block">
                  ● {t.cloudConnected} ({t.storageTier})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bilingual Language Switcher (Khmer 🇰🇭 / English 🇬🇧) */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 text-xs">
            <button
              onClick={() => setLang('km')}
              className={`px-2 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                lang === 'km' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="ប្ដូរជាភាសាខ្មែរ"
            >
              <span>🇰🇭</span>
              <span className="hidden xs:inline">ខ្មែរ</span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                lang === 'en' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              <span>🇬🇧</span>
              <span className="hidden xs:inline">EN</span>
            </button>
          </div>

          {/* Upload Button: Opens selection modal with Upload Video and Upload Photo */}
          <button
            onClick={() => setShowUploadModal(true)}
            style={{ backgroundColor: accent }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow hover:opacity-90 active:scale-95 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="hidden sm:inline">{t.uploadMedia}</span>
            <span className="sm:hidden">{t.upload}</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setDark(!dark)}
            className={`p-1.5 rounded-lg border transition cursor-pointer text-xs ${
              isLight
                ? 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-200'
                : 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700'
            }`}
          >
            {dark ? (
              <svg className="w-4 h-4 fill-current text-amber-400" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-none stroke-current text-slate-800" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Profile (PP) Button with Developer Approved Badge */}
          <div
            onClick={() => setShowProfileModal(true)}
            style={{ backgroundColor: accent }}
            className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ring-emerald-500 cursor-pointer shadow-xs overflow-hidden"
            title="Profile & Developer Status (PP)"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              'PP'
            )}
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto p-4 space-y-4">
        {/* Status notification */}
        {statusMessage && (
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} className="text-slate-400 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation: Strict Separation of Video Vault & Photo Vault */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            {
              id: 'videos' as const,
              label: `${t.videoVault || t.videoFolders} (${videoCategories.length})`,
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              id: 'photos' as const,
              label: `${t.photoVault || t.photoFolders} (${photoCategories.length})`,
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              id: 'all' as const,
              label: `${t.allMedia} (${mediaItems.length})`,
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              ),
            },
            {
              id: 'favorites' as const,
              label: `${t.favorites} (${favList.length})`,
              icon: (
                <svg
                  className={`w-3.5 h-3.5 ${tab === 'favorites' ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ),
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setSelectedFolder(null);
                if (item.id === 'videos') setNestedMediaType('videos');
                else if (item.id === 'photos') setNestedMediaType('photos');
                else setNestedMediaType('all');
              }}
              style={{ backgroundColor: tab === item.id ? accent : 'transparent' }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer shrink-0 ${
                tab === item.id
                  ? 'text-white border-transparent shadow'
                  : isLight
                  ? 'border-slate-300 text-slate-600 hover:bg-slate-200'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Sync Button */}
          {user && (
            <button
              onClick={() => loadDriveVideos()}
              disabled={loading}
              className="ml-auto text-xs opacity-75 hover:opacity-100 flex items-center gap-1 cursor-pointer shrink-0 px-2 py-1 rounded hover:bg-slate-800/40"
              title="Refresh Cloud Storage"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Sync</span>
            </button>
          )}
        </div>


        {/* 1. DEDICATED VIDEO VAULT TAB: Video Folders with Rich Avatar Covers */}
        {tab === 'videos' && !selectedFolder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ color: accent }} className="p-1.5 rounded-lg bg-sky-500/10">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {t.videoVault || t.videoFolders} ({videoCategories.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {videoCategories.map((cat, idx) => {
                const catVideos = allVideos.filter((m) => m.category === cat);
                const firstVideo = catVideos[0];
                const isLocked = !!folderLocks[`video_${cat}`]?.isLocked;

                return (
                  <div
                    key={idx}
                    className="neon-running-border cursor-pointer group"
                    onClick={() => handleOpenFolder(cat, 'video')}
                  >
                    <div className={`neon-running-inner flex flex-col justify-between p-4 ${isLight ? 'bg-white text-slate-800' : 'bg-slate-900/95 text-white'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Strictly Minimal Clean SVG Folder Icon (No thumbnail covers) */}
                          <div
                            style={{ color: accent, backgroundColor: `${accent}15`, borderColor: `${accent}30` }}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center relative shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
                          >
                            {isLocked && (
                              <div className="absolute -top-1 -right-1 p-1 rounded-full bg-rose-600 text-white shadow-md z-10" title="Locked Folder">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            )}
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
                              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-bold group-hover:text-sky-400 transition truncate flex items-center gap-1.5">
                              <span>{cat}</span>
                              {isLocked && (
                                <svg className="w-3.5 h-3.5 text-rose-400 shrink-0 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}
                            </h3>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              {catVideos.length} {t.videos}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                {catVideos.length > 0 ? (firstVideo?.isTSFile ? 'MPEG-TS' : 'Cloud Stream') : 'Empty'}
                              </span>
                              {isLocked && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  <span>PIN Lock</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 3-Dots Folder Menu Trigger (⋮) */}
                        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveFolderMenu({ name: cat, folderType: 'video' })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                            title={t.folderOptions}
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-inherit/20 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {catVideos.length > 0 ? `${catVideos.length} videos available` : t.emptyFolder}
                        </span>
                        <span className="text-sky-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          {isLocked ? (
                            <span className="text-amber-400 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              {t.enterPin}
                            </span>
                          ) : (
                            t.exploreFolder
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centered Add Video Folder Button below all cards */}
            <div className="flex justify-center pt-5 pb-2">
              <button
                onClick={() =>
                  setFolderModal({
                    open: true,
                    folderType: 'video',
                    mode: 'add',
                    oldName: '',
                    name: '',
                  })
                }
                style={{ backgroundColor: accent }}
                className="neon-action-btn px-8 py-3 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-xl transition cursor-pointer"
              >
                {t.addVideoFolder || t.addFolderTextOnly}
              </button>
            </div>
          </div>
        )}

        {/* 2. DEDICATED PHOTO VAULT TAB: Photo Folders with Rich Avatar Covers */}
        {tab === 'photos' && !selectedFolder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ color: '#10b981' }} className="p-1.5 rounded-lg bg-emerald-500/10">
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {t.photoVault || t.photoFolders} ({photoCategories.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {photoCategories.map((cat, idx) => {
                const catPhotos = allPhotos.filter((m) => m.category === cat);
                const firstPhoto = catPhotos[0];
                const isLocked = !!folderLocks[`photo_${cat}`]?.isLocked;

                return (
                  <div
                    key={idx}
                    className="neon-running-border cursor-pointer group"
                    onClick={() => handleOpenFolder(cat, 'photo')}
                  >
                    <div className={`neon-running-inner flex flex-col justify-between p-4 ${isLight ? 'bg-white text-slate-800' : 'bg-slate-900/95 text-white'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Strictly Minimal Clean SVG Folder Icon (No thumbnail covers) */}
                          <div
                            style={{ color: '#10b981', backgroundColor: '#10b98115', borderColor: '#10b98130' }}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center relative shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
                          >
                            {isLocked && (
                              <div className="absolute -top-1 -right-1 p-1 rounded-full bg-rose-600 text-white shadow-md z-10" title="Locked Folder">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            )}
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
                              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-bold group-hover:text-emerald-400 transition truncate flex items-center gap-1.5">
                              <span>{cat}</span>
                              {isLocked && (
                                <svg className="w-3.5 h-3.5 text-rose-400 shrink-0 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}
                            </h3>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              {catPhotos.length} {t.photos}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {catPhotos.length > 0 ? 'High-Res Vault' : 'Empty'}
                              </span>
                              {isLocked && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  <span>PIN Lock</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 3-Dots Folder Menu Trigger (⋮) */}
                        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveFolderMenu({ name: cat, folderType: 'photo' })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                            title={t.folderOptions}
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-inherit/20 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {catPhotos.length > 0 ? `${catPhotos.length} photos available` : t.emptyFolder}
                        </span>
                        <span className="text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          {isLocked ? (
                            <span className="text-amber-400 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              {t.enterPin}
                            </span>
                          ) : (
                            t.exploreFolder
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centered Add Photo Folder Button below all cards */}
            <div className="flex justify-center pt-5 pb-2">
              <button
                onClick={() =>
                  setFolderModal({
                    open: true,
                    folderType: 'photo',
                    mode: 'add',
                    oldName: '',
                    name: '',
                  })
                }
                style={{ backgroundColor: '#10b981' }}
                className="neon-action-btn px-8 py-3 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-xl transition cursor-pointer"
              >
                {t.addPhotoFolder || t.addFolderTextOnly}
              </button>
            </div>
          </div>
        )}

        {/* 3. NESTED FOLDER VIEW: Opened when a folder card is clicked */}
        {(tab === 'videos' || tab === 'photos') && selectedFolder && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>{t.allFolders}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">/</span>
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{selectedFolder.name}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({displayedNestedItems.length} {t.items})
                    </span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setFolderModal({
                      open: true,
                      folderType: selectedFolder.type,
                      mode: 'edit',
                      oldName: selectedFolder.name,
                      name: selectedFolder.name,
                    })
                  }
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="hidden sm:inline">{t.rename}</span>
                </button>
              </div>
            </div>

            {displayedNestedItems.length === 0 ? (
              <div className={`text-center py-16 rounded-2xl border border-dashed ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
                <p className="text-xs text-slate-400 mb-3">{t.emptyFolder}</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{ backgroundColor: accent }}
                  className="px-4 py-2 rounded-xl text-white text-xs font-semibold shadow hover:opacity-90 transition cursor-pointer"
                >
                  + {t.uploadMedia}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {displayedNestedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.type === 'image') setPreviewPhoto(item);
                      else handleOpenVideo(item);
                    }}
                    className="neon-running-border cursor-pointer group shadow-sm hover:shadow-lg transition"
                  >
                    <div className={`neon-running-inner rounded-xl overflow-hidden relative ${cardClass}`}>
                      <div className="aspect-video bg-slate-950 overflow-hidden relative">
                        <MediaThumbnailCover item={item} accent={accent} />

                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 backdrop-blur-xs text-white">
                          {item.type === 'image' ? 'PHOTO' : item.isTSFile ? '.TS STREAM' : 'VIDEO'}
                        </span>

                        {/* 3-Dots Action Menu Trigger (⋮) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionItem(item);
                          }}
                          className="absolute top-2 right-9 p-1 rounded-full bg-black/60 backdrop-blur-xs text-white hover:bg-black/90 transition cursor-pointer"
                          title={t.actions}
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaItems((prev) => {
                              const updated = prev.map((m) => (m.id === item.id ? { ...m, fav: !m.fav } : m));
                              if (userEmail) saveDriveCache(userEmail, updated);
                              return updated;
                            });
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 backdrop-blur-xs text-white hover:bg-black/80 transition"
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${item.fav ? 'fill-rose-500 text-rose-500' : 'fill-none text-white'}`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-2.5 space-y-1">
                        <p className="text-xs font-semibold truncate group-hover:text-sky-400 transition">{item.name}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{item.date} • {item.size}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ALL MEDIA & FAVORITES VIEWS */}
        {(tab === 'all' || tab === 'favorites') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {tab === 'favorites' ? t.favorites : t.allMedia}
              </h2>
              <span className="text-xs text-slate-500">
                {tab === 'favorites' ? favList.length : mediaItems.length} {t.items}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(tab === 'favorites' ? favList : mediaItems).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'image') setPreviewPhoto(item);
                    else handleOpenVideo(item);
                  }}
                  className="neon-running-border cursor-pointer group shadow-sm hover:shadow-lg transition"
                >
                  <div className={`neon-running-inner rounded-xl overflow-hidden relative ${cardClass}`}>
                    <div className="aspect-video bg-slate-950 overflow-hidden relative">
                      <MediaThumbnailCover item={item} accent={accent} />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 backdrop-blur-xs text-white">
                        {item.type === 'image' ? 'PHOTO' : item.isTSFile ? '.TS STREAM' : 'VIDEO'}
                      </span>

                      {/* 3-Dots Action Menu Trigger (⋮) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionItem(item);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 backdrop-blur-xs text-white hover:bg-black/90 transition cursor-pointer"
                        title={t.actions}
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold truncate group-hover:text-sky-400 transition">{item.name}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                        <span>{item.size}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400">
                          {item.category || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 3-DOTS ACTION SHEET MODAL */}
      {activeActionItem && !showRenameMediaModal && !showMoveFolderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveActionItem(null)}
        >
          <div
            className="max-w-xs w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold truncate pr-2">{activeActionItem.name}</span>
              <button onClick={() => setActiveActionItem(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => {
                  setRenameMediaInput(activeActionItem.name);
                  setShowRenameMediaModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-2.5 font-semibold transition cursor-pointer"
              >
                <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>{t.rename}</span>
              </button>

              <button
                onClick={() => setShowMoveFolderModal(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-2.5 font-semibold transition cursor-pointer"
              >
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>{t.move}</span>
              </button>

              <button
                onClick={() => {
                  const item = activeActionItem;
                  setActiveActionItem(null);
                  setFileToDelete(item);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white flex items-center gap-2.5 font-semibold transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{t.delete}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MEDIA MODAL */}
      {showRenameMediaModal && activeActionItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowRenameMediaModal(false)}
        >
          <div
            className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold">{t.renameMedia}</span>
              <button onClick={() => setShowRenameMediaModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleRenameMediaSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={renameMediaInput}
                onChange={(e) => setRenameMediaInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-sky-500"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRenameMediaModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: accent }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white shadow hover:opacity-90 transition cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE FOLDER MODAL */}
      {showMoveFolderModal && activeActionItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowMoveFolderModal(false)}
        >
          <div
            className="max-w-xs w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-white space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold">{t.move}</span>
              <button onClick={() => setShowMoveFolderModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {(activeActionItem.type === 'image' ? photoCategories : videoCategories).map((folderName) => (
                <button
                  key={folderName}
                  onClick={() => handleMoveMediaFolder(folderName)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-between ${
                    activeActionItem.category === folderName
                      ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <span className="truncate">{folderName}</span>
                  {activeActionItem.category === folderName && <span>✓</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowMoveFolderModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Real-time Upload Progress Bar Modal (XMLHttpRequest with Loaded MBs) */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div style={{ backgroundColor: accent }} className="w-2.5 h-2.5 rounded-full animate-ping" />
                <span className="text-xs font-bold">Uploading to Cloud Storage</span>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400">{uploadProgress.percent}%</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold truncate text-slate-200">{uploadFileName}</p>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{uploadProgress.loadedMB} MB / {uploadProgress.totalMB} MB</span>
                <span>{uploadIsTS ? 'MPEG-TS' : uploadFileType === 'image' ? 'Photo' : 'Video'}</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                style={{
                  backgroundColor: accent,
                  width: `${uploadProgress.percent}%`,
                  boxShadow: `0 0 12px ${accent}`,
                }}
                className="h-full rounded-full transition-all duration-150"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">Target: {selectedFolder?.name || 'Main Vault'}</span>
              <button
                onClick={handleCancelUpload}
                className="px-3 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-rose-400 transition cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Full-Bleed Video Modal Layout with Instant Native Play Button */}
      {playVideo && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col justify-between animate-in fade-in duration-200"
          onClick={() => setPlayVideo(null)}
        >
          {/* Minimalist Top Bar: Slim, semi-transparent, and floating at the top */}
          <div
            className="w-full px-4 py-2.5 sm:py-3 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Video file name and size */}
            <div className="truncate max-w-[65%] sm:max-w-[75%]">
              <h3 className="text-xs sm:text-sm font-semibold truncate text-white drop-shadow">
                {playVideo.name}
              </h3>
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
                {playVideo.size}
              </span>
            </div>

            {/* Right: Direct Pop-out button (↗) linking to Google Drive view with target="_blank" and Close button (✕) */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={
                  playVideo.driveId || (!playVideo.id.startsWith('demo_') && !playVideo.id.startsWith('local_'))
                    ? `https://drive.google.com/file/d/${playVideo.driveId || playVideo.id}/view`
                    : playVideo.url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition cursor-pointer border border-white/10 active:scale-95"
                title={lang === 'km' ? 'បើកផ្ទាំងពេញក្នុង Google Drive (↗)' : 'Pop-out Full Window (↗)'}
                aria-label="Pop-out Full Window"
              >
                <span className="text-sm font-bold leading-none">↗</span>
                <span className="hidden sm:inline text-[11px] font-sans">Drive</span>
              </a>

              <button
                type="button"
                onClick={() => setPlayVideo(null)}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0 border border-white/10 active:scale-95"
                title="Close Player"
                aria-label="Close Player"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Full available screen Google Drive Native Embed iframe */}
          <div
            className="w-full flex-1 relative flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {playVideo.id.startsWith('demo_') || playVideo.id.startsWith('local_') ? (
              <video
                src={playVideo.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <iframe
                src={`https://drive.google.com/file/d/${playVideo.driveId || playVideo.id}/preview`}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={playVideo.name}
              />
            )}
          </div>

          {/* Instant Action Button for Third-Party Cookie / Storage Access Restrictions */}
          <div
            className="w-full px-4 py-2.5 sm:py-3 bg-black/85 backdrop-blur-md border-t border-white/10 flex items-center justify-center shrink-0 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={
                playVideo.driveId || (!playVideo.id.startsWith('demo_') && !playVideo.id.startsWith('local_'))
                  ? `https://drive.google.com/file/d/${playVideo.driveId || playVideo.id}/view`
                  : playVideo.url
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: accent }}
              className="neon-action-btn w-full max-w-xl py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl text-white text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 text-center"
            >
              <span>▶️ ចាក់វីដេអូផ្ទាល់ / បើក Fullscreen (Open Native Video Player)</span>
            </a>
          </div>
        </div>
      )}

      {/* Add / Edit Folder Modal */}
      {folderModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setFolderModal({ open: false, folderType: 'video', mode: 'add', oldName: '', name: '' })}
        >
          <div
            className="neon-running-border max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-5 sm:p-6 text-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold">
                  {folderModal.mode === 'add' ? t.addFolderTextOnly : t.rename}
                </span>
                <button
                  onClick={() => setFolderModal({ open: false, folderType: 'video', mode: 'add', oldName: '', name: '' })}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Folder Type Selector in Add mode */}
              {folderModal.mode === 'add' && (
                <div className="flex bg-slate-800 p-1 rounded-xl text-xs gap-1">
                  <button
                    type="button"
                    onClick={() => setFolderModal((prev) => ({ ...prev, folderType: 'video' }))}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      folderModal.folderType === 'video' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.videoFolders}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFolderModal((prev) => ({ ...prev, folderType: 'photo' }))}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      folderModal.folderType === 'photo' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.photoFolders}
                  </button>
                </div>
              )}

              <form onSubmit={handleSaveFolder} className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    {folderModal.folderType === 'video' ? 'Video Folder Name' : 'Photo Folder Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={folderModal.name}
                    onChange={(e) => setFolderModal({ ...folderModal, name: e.target.value })}
                    placeholder="e.g. Vacation 2026, Tutorials"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-sky-500"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setFolderModal({ open: false, folderType: 'video', mode: 'add', oldName: '', name: '' })}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: accent }}
                    className="neon-action-btn flex-1 py-2 rounded-xl text-xs font-semibold text-white shadow hover:opacity-90 transition cursor-pointer"
                  >
                    {folderModal.mode === 'add' ? t.create : t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3-DOTS FOLDER ACTION MENU MODAL (Rename & Delete) */}
      {activeFolderMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveFolderMenu(null)}
        >
          <div
            className="neon-running-border max-w-xs w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-5 space-y-3 text-white">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-xs font-bold truncate">{activeFolderMenu.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-mono">
                    {activeFolderMenu.folderType === 'video' ? t.videoFolders : t.photoFolders}
                  </span>
                </div>
                <button onClick={() => setActiveFolderMenu(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    const target = activeFolderMenu;
                    setActiveFolderMenu(null);
                    setFolderModal({
                      open: true,
                      folderType: target.folderType,
                      mode: 'edit',
                      oldName: target.name,
                      name: target.name,
                    });
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-2.5 font-semibold transition cursor-pointer"
                >
                  <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>{t.rename}</span>
                </button>

                {/* Lock Folder Feature */}
                {folderLocks[`${activeFolderMenu.folderType}_${activeFolderMenu.name}`]?.isLocked ? (
                  <button
                    onClick={() => {
                      const target = activeFolderMenu;
                      setActiveFolderMenu(null);
                      setUnlockFolderModal({
                        name: target.name,
                        folderType: target.folderType,
                        isRemovingLock: true,
                      });
                      setUnlockPinInput('');
                      setUnlockDobInput('');
                      setIsForgotPinMode(false);
                      setUnlockModalError('');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 flex items-center gap-2.5 font-semibold transition cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span>{t.removeLock}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const target = activeFolderMenu;
                      setActiveFolderMenu(null);
                      setShowSetFolderLockModal({
                        name: target.name,
                        folderType: target.folderType,
                      });
                      setLockPinInput('');
                      setLockDobInput('');
                      setLockModalError('');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 flex items-center gap-2.5 font-semibold transition cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>{t.lockFolder}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const target = activeFolderMenu;
                    setActiveFolderMenu(null);
                    const count = mediaItems.filter((m) => m.category === target.name).length;
                    if (count > 0) {
                      setBlockedFolderDelete({
                        name: target.name,
                        folderType: target.folderType,
                        count,
                      });
                    } else {
                      setFolderToDelete({
                        name: target.name,
                        folderType: target.folderType,
                      });
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white flex items-center gap-2.5 font-semibold transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{t.delete}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOCKED FOLDER DELETE WARNING MODAL: When folder has items */}
      {blockedFolderDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setBlockedFolderDelete(null)}
        >
          <div
            className="neon-running-border max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-6 space-y-4 text-center text-white">
              <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{t.cannotDeleteTitle}</h3>
                <p className="text-xs text-amber-400 font-semibold truncate px-2">
                  &ldquo;{blockedFolderDelete.name}&rdquo;
                </p>
                <p className="text-xs text-slate-300 leading-relaxed px-1">
                  {lang === 'km'
                    ? `ថតនេះមានឯកសារចំនួន ${blockedFolderDelete.count}។ សូមផ្ទេរ ឬផ្លាស់ប្ដូរឯកសារទាំងអស់ទៅថតផ្សេងទៀតសិន មុនពេលលុប។`
                    : `This folder contains ${blockedFolderDelete.count} item(s). Please move all items to another folder before deleting.`}
                </p>
              </div>

              <button
                onClick={() => setBlockedFolderDelete(null)}
                style={{ backgroundColor: accent }}
                className="neon-action-btn w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition cursor-pointer"
              >
                {t.understood}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE FOLDER MODAL (Only for empty folders) */}
      {folderToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setFolderToDelete(null)}
        >
          <div
            className="neon-running-border max-w-xs w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-5 space-y-4 text-center text-white">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <div>
                <h3 className="text-xs font-bold">{t.confirmDeleteFolderTitle} &ldquo;{folderToDelete.name}&rdquo;?</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t.confirmDeleteFolderMsg}
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setFolderToDelete(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => handleDeleteFolder(folderToDelete.name, folderToDelete.folderType)}
                  className="neon-action-btn flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow transition cursor-pointer"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE FROM GOOGLE DRIVE MODAL (Permanent Deletion) */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !isDeletingDriveFile && setFileToDelete(null)}
        >
          <div
            className="neon-running-border max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-6 space-y-4 text-center text-white">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">
                  {t.confirmDeleteDriveTitle}
                </h3>
                <p className="text-xs text-rose-300 font-semibold truncate px-2">
                  &ldquo;{fileToDelete.name}&rdquo;
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed px-1">
                  {t.confirmDeleteDriveMsg}
                </p>
              </div>

              {/* File preview summary badge */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="truncate font-mono">{fileToDelete.size}</span>
                </div>
                <span className="text-sky-400 font-mono shrink-0">{fileToDelete.category || 'General'}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  disabled={isDeletingDriveFile}
                  onClick={() => setFileToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <button
                  disabled={isDeletingDriveFile}
                  onClick={handleConfirmDeleteDriveFile}
                  className="neon-action-btn flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isDeletingDriveFile ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{t.deletingDrive}</span>
                    </>
                  ) : (
                    <span>{t.deletePermanently}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 text-xs border-b border-slate-800 text-white">
              <span className="font-semibold truncate">{previewPhoto.name}</span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-center bg-black max-h-[75vh] overflow-hidden p-2">
              <img
                src={previewPhoto.directUrl || previewPhoto.previewUrl || previewPhoto.url}
                alt={previewPhoto.name}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="p-3 text-[11px] text-slate-400 flex justify-between bg-slate-900 border-t border-slate-800">
              <span>{previewPhoto.size}</span>
              <span className="text-emerald-400 font-mono">{previewPhoto.category}</span>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MEDIA SELECTION MODAL: Video vs Photo */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="neon-running-border max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-5 sm:p-6 space-y-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div style={{ backgroundColor: accent }} className="p-2 rounded-xl text-white">
                    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">{t.uploadMedia}</h3>
                    <p className="text-[11px] text-slate-400">{t.selectUploadType}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-full cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Two Distinct Upload Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Upload Video Card */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    videoInputRef.current?.click();
                  }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-slate-800/80 to-slate-800/60 border border-sky-500/30 hover:border-sky-400 hover:bg-sky-500/20 text-left transition-all duration-200 group cursor-pointer space-y-3 shadow-md hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition flex items-center justify-between">
                      <span>{t.uploadVideo}</span>
                      <span className="text-sky-400 text-xs">›</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {t.uploadVideoDesc}
                    </p>
                  </div>
                </button>

                {/* Upload Photo Card */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    photoInputRef.current?.click();
                  }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-800/80 to-slate-800/60 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20 text-left transition-all duration-200 group cursor-pointer space-y-3 shadow-md hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition flex items-center justify-between">
                      <span>{t.uploadPhoto}</span>
                      <span className="text-emerald-400 text-xs">›</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {t.uploadPhotoDesc}
                    </p>
                  </div>
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target Folder Selection Modal (Choose folder before uploading) */}
      {showTargetFolderModal && pendingUploadFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            setShowTargetFolderModal(false);
            setPendingUploadFile(null);
          }}
        >
          <div
            className="neon-running-border max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-6 space-y-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: pendingUploadType === 'video' ? `${accent}20` : '#10b98120',
                      color: pendingUploadType === 'video' ? accent : '#10b981',
                    }}
                    className="p-2.5 rounded-2xl"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {t.selectTargetFolder || 'Select Target Folder'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {t.selectTargetFolderDesc || 'Choose where to save this media before uploading'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowTargetFolderModal(false);
                    setPendingUploadFile(null);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* File Info preview pill */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">{pendingUploadType === 'photo' ? '🖼️' : '🎬'}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{pendingUploadFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {(pendingUploadFile.size / (1024 * 1024)).toFixed(2)} MB • {pendingUploadType === 'photo' ? 'Photo' : 'Video'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                  Ready
                </span>
              </div>

              {/* Folder List Options */}
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {(pendingUploadType === 'video' ? videoCategories : photoCategories).map((folderName) => {
                  const isSelected = targetFolderSelection === folderName && !showNewFolderInline;
                  const isFolderLocked = !!folderLocks[`${pendingUploadType}_${folderName}`]?.isLocked;

                  return (
                    <button
                      key={folderName}
                      type="button"
                      onClick={() => {
                        setTargetFolderSelection(folderName);
                        setShowNewFolderInline(false);
                      }}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-sky-500/80 bg-sky-500/15 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <svg
                          className={`w-4 h-4 shrink-0 ${isSelected ? 'text-sky-400 fill-current' : 'text-slate-400 fill-current'}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                        </svg>
                        <span className="text-xs font-semibold truncate">{folderName}</span>
                        {isFolderLocked && (
                          <svg className="w-3 h-3 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-sky-400 bg-sky-500' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}

                {/* Inline New Folder Option */}
                {showNewFolderInline ? (
                  <div className="p-3 rounded-xl border border-sky-500/50 bg-slate-800/80 space-y-2 mt-2">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      {t.enterNewFolderName || 'Enter New Folder Name'}:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newFolderNameInput}
                        onChange={(e) => setNewFolderNameInput(e.target.value)}
                        placeholder={pendingUploadType === 'video' ? 'e.g. Vacation 2026' : 'e.g. Portraits'}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewFolderInline(false)}
                        className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNewFolderInline(true)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer mt-1"
                  >
                    <span className="text-base font-bold">+</span>
                    <span>{t.addFolderTextOnly}</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowTargetFolderModal(false);
                    setPendingUploadFile(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmTargetFolderUpload()}
                  style={{ backgroundColor: accent }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t.confirmAndUpload || 'Upload to Folder'}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SET FOLDER LOCK MODAL: 4-Digit PIN & Birthday Recovery */}
      {showSetFolderLockModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSetFolderLockModal(null)}
        >
          <div
            className="neon-running-border max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-6 space-y-4 text-white">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{t.lockFolder}</h3>
                    <p className="text-[10px] text-amber-400 font-semibold truncate max-w-[180px]">
                      &ldquo;{showSetFolderLockModal.name}&rdquo;
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSetFolderLockModal(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-full cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {t.setFolderPinDesc}
              </p>

              {lockModalError && (
                <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {lockModalError}
                </div>
              )}

              <form onSubmit={handleSaveSetFolderLock} className="space-y-4">
                {/* 4-Digit PIN */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>{t.enterFolderPin}</span>
                    <span className="text-[10px] text-slate-400 font-mono">4 digits</span>
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    required
                    value={lockPinInput}
                    onChange={(e) => {
                      setLockPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                      setLockModalError('');
                    }}
                    placeholder="••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-center tracking-widest text-lg font-mono font-bold text-white focus:outline-hidden focus:border-amber-400"
                    autoFocus
                  />
                </div>

                {/* Date of Birth Recovery Question */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    {t.dateOfBirthRecovery}
                  </label>
                  <input
                    type="date"
                    required
                    value={lockDobInput}
                    onChange={(e) => {
                      setLockDobInput(e.target.value);
                      setLockModalError('');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    {lang === 'km' ? 'ប្រើសម្រាប់ដោះសោក្នុងករណីភ្លេចលេខកូដសម្ងាត់ ៤ ខ្ទង់។' : 'Used to unlock this folder if you forget your 4-digit PIN.'}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSetFolderLockModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: accent }}
                    className="neon-action-btn flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>{t.lockFolder}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* UNLOCK PROTECTED FOLDER MODAL: PIN or Birthday Recovery */}
      {unlockFolderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setUnlockFolderModal(null)}
        >
          <div
            className="neon-running-border max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 p-6 space-y-4 text-white text-center">
              <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  {unlockFolderModal.isRemovingLock ? t.removeLock : t.lockedFolderBadge}
                </h3>
                <p className="text-xs text-amber-400 font-semibold truncate px-2 mt-0.5">
                  &ldquo;{unlockFolderModal.name}&rdquo;
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  {isForgotPinMode
                    ? (lang === 'km' ? 'បញ្ចូលថ្ងៃខែឆ្នាំកំណើតដែលបានចុះឈ្មោះដើម្បីដោះសោ' : 'Enter your registered Date of Birth to verify & unlock.')
                    : (lang === 'km' ? 'បញ្ចូលលេខកូដសម្ងាត់ ៤ ខ្ទង់ដើម្បីបើកថតនេះ' : 'Enter 4-digit PIN to open this protected folder.')}
                </p>
              </div>

              {unlockModalError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                  {unlockModalError}
                </div>
              )}

              <form onSubmit={handleVerifyUnlock} className="space-y-4 text-left">
                {!isForgotPinMode ? (
                  /* Mode 1: 4-Digit PIN input */
                  <div className="space-y-2">
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      required
                      value={unlockPinInput}
                      onChange={(e) => {
                        setUnlockPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                        setUnlockModalError('');
                      }}
                      placeholder="••••"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-center tracking-widest text-xl font-mono font-bold text-white focus:outline-hidden focus:border-amber-400"
                      autoFocus
                    />
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPinMode(true);
                          setUnlockModalError('');
                          setUnlockDobInput('');
                        }}
                        className="text-xs text-sky-400 hover:text-sky-300 underline cursor-pointer font-medium"
                      >
                        {t.birthdayUnlockOption}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Mode 2: Birthday Recovery input */
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {t.dateOfBirthRecovery}
                    </label>
                    <input
                      type="date"
                      required
                      value={unlockDobInput}
                      onChange={(e) => {
                        setUnlockDobInput(e.target.value);
                        setUnlockModalError('');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                      autoFocus
                    />
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPinMode(false);
                          setUnlockModalError('');
                          setUnlockPinInput('');
                        }}
                        className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        ← {t.backToPin}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUnlockFolderModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: accent }}
                    className="neon-action-btn flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition cursor-pointer"
                  >
                    {isForgotPinMode ? t.verifyBirthday : (unlockFolderModal.isRemovingLock ? t.removeLock : t.unlockFolder)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal with Developer Approval Panel & Complete Sign Out */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-full cursor-pointer"
            >
              ✕
            </button>

            {/* Profile Avatar & Info */}
            <div className="text-center space-y-2.5">
              <div className="relative w-20 h-20 mx-auto group">
                <div
                  style={{ backgroundColor: accent }}
                  className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold border-2 border-emerald-500 shadow-xl overflow-hidden ring-4 ring-emerald-500/20"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : user?.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    'PP'
                  )}
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white shadow-lg transition cursor-pointer"
                  title="Change Avatar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = URL.createObjectURL(f);
                      setUserAvatar(url);
                      localStorage.setItem('vault_user_avatar', url);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="font-bold text-base">{user?.displayName || userEmail?.split('@')[0] || 'Phon Phal'}</h3>
                <p className="text-xs text-slate-400 font-mono">{userEmail || 'phonphaihdvk@gmail.com'}</p>
              </div>

              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{isDeveloperAdmin ? t.developerBadge : t.verifiedMember}</span>
                </span>
              </div>
            </div>

            {/* Storage Quota Card */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-slate-300">
                <span>{t.storageDisplay}</span>
                <span className="text-emerald-400 font-mono">{t.storageTier}</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div style={{ backgroundColor: accent, width: '8%' }} className="h-full rounded-full" />
              </div>
            </div>

            {/* Dedicated Developer Admin Panel Action Button (Exclusive to Admin Phon Phal) */}
            {isDeveloperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowDevAdminModal(true);
                }}
                className="neon-action-btn w-full p-3.5 rounded-2xl bg-gradient-to-r from-sky-600/20 via-sky-500/25 to-indigo-600/20 border border-sky-500/40 text-left flex items-center justify-between group transition cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-sky-400 shadow-sm shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                      {t.devAdminPanel || t.developerApproval}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Manage whitelist, pre-approve emails & user access
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    Admin
                  </span>
                  <span className="text-sky-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                </div>
              </button>
            )}

            {/* PIN & QR Shortcuts Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setShowChangePinModal(true);
                }}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-1.5 font-semibold text-slate-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>{t.changePin}</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setShowQRModal(true);
                }}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-1.5 font-semibold text-slate-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span>Download QR</span>
              </button>
            </div>

            {/* Complete Sign Out Button */}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                {t.cancel}
              </button>

              <button
                onClick={handleSignOutComplete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t.signOutComplete}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED DEVELOPER ADMIN PANEL MODAL (Admin: Phon Phal) */}
      {showDevAdminModal && isDeveloperAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowDevAdminModal(false)}
        >
          <div
            className="neon-running-border max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-sky-400 shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.devAdminPanel || t.developerApproval}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Admin: {DEVELOPER_ADMIN_EMAIL}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDevAdminModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Approval Enforcement Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs">
                <div>
                  <h4 className="font-bold text-slate-200">Enforce Developer Whitelist</h4>
                  <p className="text-[11px] text-slate-400">Require admin approval before new users can access the Vault</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireDeveloperApproval}
                    onChange={(e) => setRequireDeveloperApproval(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>

              {/* Pre-approve new user form */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Pre-approve New User by Email</label>
                <form onSubmit={handlePreapproveUser} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newPreapproveEmail}
                    onChange={(e) => setNewPreapproveEmail(e.target.value)}
                    placeholder="e.g. client@gmail.com"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-sky-500 placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: accent }}
                    className="neon-action-btn px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition cursor-pointer shrink-0"
                  >
                    + Pre-approve
                  </button>
                </form>
              </div>

              {/* User management list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                  <span>Registered & Pre-approved Users ({vaultUsers.length})</span>
                  <span>Access Status</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {vaultUsers.map((u) => (
                    <div
                      key={u.email}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold truncate text-white">{u.email}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-mono font-bold uppercase ${
                            u.status === 'approved' ? 'text-emerald-400' : u.status === 'rejected' ? 'text-rose-400' : 'text-amber-400'
                          }`}>
                            ● {u.status} {u.role === 'admin' ? '(Admin)' : ''}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{u.date}</span>
                        </div>
                      </div>

                      {u.email.toLowerCase() !== DEVELOPER_ADMIN_EMAIL.toLowerCase() ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {u.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateUserStatus(u.email, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer text-xs shadow-xs"
                            >
                              Approve
                            </button>
                          )}
                          {u.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateUserStatus(u.email, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold transition cursor-pointer text-xs shadow-xs"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          Super Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDevAdminModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set / Change Custom PIN Modal */}
      {showChangePinModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowChangePinModal(false)}
        >
          <div
            className="max-w-xs w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold">{t.changePin}</span>
              <button onClick={() => setShowChangePinModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomPin} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 5678"
                  className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-sky-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Re-enter 4 digits"
                  className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {changePinError && <p className="text-xs text-rose-400 font-medium text-center">{changePinError}</p>}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: accent }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white shadow hover:opacity-90 transition cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal with Download QR Button */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="max-w-xs w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-bold">QR Mobile Login</span>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-400">Scan with phone camera to instantly link with your Cloud vault</p>

            <div className="bg-white p-3 rounded-2xl mx-auto w-44 h-44 flex items-center justify-center shadow-lg">
              <svg id="qr-code-svg" className="w-36 h-36" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="30" height="30" fill="none" stroke="#000" strokeWidth="6" />
                <rect x="15" y="15" width="10" height="10" fill="#000" />
                <rect x="65" y="5" width="30" height="30" fill="none" stroke="#000" strokeWidth="6" />
                <rect x="75" y="15" width="10" height="10" fill="#000" />
                <rect x="5" y="65" width="30" height="30" fill="none" stroke="#000" strokeWidth="6" />
                <rect x="15" y="75" width="10" height="10" fill="#000" />
                <rect x="45" y="10" width="8" height="8" fill="#0284c7" />
                <rect x="45" y="25" width="8" height="8" fill="#000" />
                <rect x="10" y="45" width="8" height="8" fill="#000" />
                <rect x="25" y="45" width="8" height="8" fill="#0284c7" />
                <rect x="40" y="40" width="20" height="20" fill="#0284c7" />
                <rect x="65" y="45" width="8" height="8" fill="#000" />
                <rect x="80" y="45" width="8" height="8" fill="#000" />
                <rect x="45" y="65" width="8" height="8" fill="#000" />
                <rect x="45" y="80" width="8" height="8" fill="#0284c7" />
                <rect x="65" y="65" width="12" height="12" fill="#000" />
                <rect x="82" y="82" width="8" height="8" fill="#000" />
              </svg>
            </div>

            <p className="text-[10px] text-emerald-400 font-mono">
              Linked: {userEmail || 'phonphaihdvk@gmail.com'}
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleDownloadQR}
                style={{ backgroundColor: accent }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow hover:opacity-90 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download QR Code</span>
              </button>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Menu Drawer */}
      {menu && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setMenu(false)}>
          <div
            className={`w-80 h-full p-4 border-r shadow-2xl space-y-4 overflow-y-auto no-scrollbar z-10 flex flex-col justify-between ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : bgStyle === 'black'
                ? 'bg-[#0a0a0a] border-neutral-800 text-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-inherit/20 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>Vault & Theme Settings</span>
                </span>
                <button onClick={() => setMenu(false)} className="text-slate-400 hover:text-white cursor-pointer p-1">
                  ✕
                </button>
              </div>

              {/* Language Switcher in Drawer */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{t.language}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLang('km')}
                    className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      lang === 'km' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🇰🇭</span>
                    <span>ខ្មែរ</span>
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      lang === 'en' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              </div>

              {/* Cloud Storage Usage Card exclusively inside 3-bar Sidebar Menu */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ color: accent }} className="p-1.5 rounded-lg bg-sky-500/10">
                      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold leading-tight">{t.storageUsage}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {mediaItems.length} {t.items} ({allVideos.length} {t.videos}, {allPhotos.length} {t.photos})
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 font-mono">
                    {storagePercentDisplay}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-0.5">
                  <span className="font-bold text-sky-400">{usedStorageDisplay}</span>
                  <span className="text-[11px] text-slate-400">{t.usedOf} <span className="text-slate-200 font-semibold">{storageLimitDisplay}</span></span>
                </div>

                {/* Glowing Animated Progress Bar */}
                <div className="w-full bg-slate-900/80 h-2.5 rounded-full overflow-hidden p-0.5 relative border border-slate-700/40">
                  <div
                    style={{
                      width: `${storagePercent}%`,
                      background: `linear-gradient(90deg, #0ea5e9, ${accent}, #a855f7)`,
                      boxShadow: `0 0 10px ${accent}`,
                    }}
                    className="h-full rounded-full transition-all duration-300 relative"
                  >
                    <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span className="truncate">Google Drive 5TB Quota</span>
                  {user && (
                    <button
                      onClick={() => loadDriveVideos()}
                      disabled={loading}
                      className="text-sky-400 hover:text-white flex items-center gap-1 cursor-pointer font-semibold shrink-0"
                    >
                      <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Sync</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Card in Drawer */}
              <div
                onClick={() => {
                  setMenu(false);
                  setShowProfileModal(true);
                }}
                className="text-xs p-3 rounded-xl bg-slate-500/10 space-y-1.5 cursor-pointer hover:bg-slate-500/20 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    style={{ backgroundColor: accent }}
                    className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 shadow-sm"
                  >
                    {userAvatar ? (
                      <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                    ) : user?.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      'PP'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{user?.displayName || userEmail?.split('@')[0] || 'Phon Phal'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{userEmail || 'phonphaihdvk@gmail.com'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/30 text-[10px]">
                  <span className="text-emerald-400 font-medium">● {t.cloudConnected}</span>
                  <span className="text-sky-400 underline">Profile Settings ›</span>
                </div>
              </div>

              {/* Developer Admin Panel Shortcut in Drawer */}
              {isDeveloperAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    setShowDevAdminModal(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-left flex items-center justify-between text-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-bold text-sky-400">{t.devAdminPanel || t.developerApproval}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">Admin</span>
                </button>
              )}

              {/* Developer / API Configuration Button in Drawer */}
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  setShowApiConfigModal(true);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="font-semibold text-slate-200">{t.devApiConfig}</span>
                </div>
                <span className="text-slate-400 font-bold">›</span>
              </button>

              {/* 10 Vibrant Accent Colors */}
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide flex justify-between">
                  <span>Accent Colors (10)</span>
                  <span className="font-mono text-[10px] text-sky-400">{accent}</span>
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setAccent(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`h-7 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                        accent === c.hex ? 'scale-110 ring-2 ring-white shadow-lg' : 'opacity-85 hover:opacity-100 hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      {accent === c.hex && <span className="text-white text-[10px] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-Color Gradient Themes & Background Styles */}
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">
                  Gradient Themes
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setDark(true);
                      setBgStyle('aurora');
                    }}
                    style={
                      !isLight && bgStyle === 'aurora'
                        ? { borderColor: accent, boxShadow: `0 0 10px ${accent}40` }
                        : undefined
                    }
                    className={`p-2 rounded-xl border text-left transition cursor-pointer bg-gradient-to-br from-[#03151b] via-[#05262c] to-[#0d1631] text-teal-200 ${
                      !isLight && bgStyle === 'aurora' ? 'border-sky-400 font-bold' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-xs" />
                      <span className="text-[11px]">Aurora</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDark(true);
                      setBgStyle('sunset');
                    }}
                    style={
                      !isLight && bgStyle === 'sunset'
                        ? { borderColor: accent, boxShadow: `0 0 10px ${accent}40` }
                        : undefined
                    }
                    className={`p-2 rounded-xl border text-left transition cursor-pointer bg-gradient-to-br from-[#180812] via-[#240c17] to-[#120a21] text-rose-200 ${
                      !isLight && bgStyle === 'sunset' ? 'border-sky-400 font-bold' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-xs" />
                      <span className="text-[11px]">Sunset</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDark(true);
                      setBgStyle('cyber');
                    }}
                    style={
                      !isLight && bgStyle === 'cyber'
                        ? { borderColor: accent, boxShadow: `0 0 10px ${accent}40` }
                        : undefined
                    }
                    className={`p-2 rounded-xl border text-left transition cursor-pointer bg-gradient-to-br from-[#090014] via-[#15002b] to-[#001322] text-fuchsia-200 ${
                      !isLight && bgStyle === 'cyber' ? 'border-sky-400 font-bold' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-xs" />
                      <span className="text-[11px]">Neon Cyber</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDark(true);
                      setBgStyle('midnight');
                    }}
                    style={
                      !isLight && bgStyle === 'midnight'
                        ? { borderColor: accent, boxShadow: `0 0 10px ${accent}40` }
                        : undefined
                    }
                    className={`p-2 rounded-xl border text-left transition cursor-pointer bg-gradient-to-br from-[#020617] via-[#081229] to-[#020617] text-sky-200 ${
                      !isLight && bgStyle === 'midnight' ? 'border-sky-400 font-bold' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-xs" />
                      <span className="text-[11px]">Midnight</span>
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <button
                    onClick={() => {
                      setDark(true);
                      setBgStyle('slate');
                    }}
                    className={`p-1.5 rounded-lg border text-[10px] text-center transition cursor-pointer ${
                      !isLight && bgStyle === 'slate'
                        ? 'border-sky-400 bg-slate-800 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Dark Slate
                  </button>
                  <button
                    onClick={() => {
                      setDark(true);
                      setBgStyle('black');
                    }}
                    className={`p-1.5 rounded-lg border text-[10px] text-center transition cursor-pointer ${
                      !isLight && bgStyle === 'black'
                        ? 'border-sky-400 bg-black text-white font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    AMOLED
                  </button>
                  <button
                    onClick={() => setDark(false)}
                    className={`p-1.5 rounded-lg border text-[10px] text-center transition cursor-pointer ${
                      isLight
                        ? 'border-sky-400 bg-slate-200 text-slate-900 font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Sign Out Action */}
            <div className="pt-3 border-t border-inherit/20 space-y-2">
              <button
                onClick={handleSignOutComplete}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow transition cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEVELOPER / GOOGLE API CONFIGURATION MODAL (For Netlify & Standalone Deployments) */}
      {showApiConfigModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowApiConfigModal(false)}
        >
          <div
            className="neon-running-border max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neon-running-inner bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.devApiConfig}</h3>
                    <p className="text-[10px] text-slate-400">Netlify Deployment & Google OAuth 2.0</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowApiConfigModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {t.devApiConfigDesc}
              </p>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Google Cloud Console Setup:</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Add your Netlify domain (e.g. <span className="text-white font-mono font-bold">https://your-site.netlify.app</span>) under <span className="text-slate-200">Authorized JavaScript Origins</span> in Google Cloud Console Credentials.
                </p>
              </div>

              {apiConfigSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-in fade-in">
                  ✓ {apiConfigSuccess}
                </div>
              )}

              <form onSubmit={handleSaveApiConfig} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.googleClientIdLabel} <span className="text-amber-400 font-mono">*</span>
                  </label>
                  <input
                    type="text"
                    value={customClientIdInput}
                    onChange={(e) => setCustomClientIdInput(e.target.value)}
                    placeholder="e.g. 739079755169-xxxx.apps.googleusercontent.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-hidden focus:border-amber-400 placeholder-slate-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Saved in browser localStorage (fallback to VITE_GOOGLE_CLIENT_ID).
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.googleApiKeyLabel} <span className="text-slate-500 font-mono text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={customApiKeyInput}
                    onChange={(e) => setCustomApiKeyInput(e.target.value)}
                    placeholder="e.g. AIzaSy..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-hidden focus:border-amber-400 placeholder-slate-500"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowApiConfigModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: accent }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{t.saveCredentials}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
