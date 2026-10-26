import { StoredVideo, VideoResolution, LearningCategory, QuizQuestion, VocabItem } from '../types/video';

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  resolution: VideoResolution;
  thumbnailUrl: string;
}

export function determineResolution(width: number, height: number): VideoResolution {
  const maxDim = Math.max(width, height);
  const minDim = Math.min(width, height);

  if (maxDim >= 3840 || minDim >= 2160) {
    return '4K UHD';
  }
  if (maxDim >= 1920 || minDim >= 1080) {
    return '1080p FHD';
  }
  if (maxDim >= 1280 || minDim >= 720) {
    return '720p HD';
  }
  return 'SD';
}

export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const cleanUp = () => {
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      const resolution = determineResolution(width, height);

      const seekTime = Math.min(Math.max(duration * 0.1, 0.5), 5);
      video.currentTime = seekTime;

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(width, 640);
          canvas.height = Math.round((canvas.width / width) * height) || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);
            cleanUp();
            resolve({
              duration,
              width,
              height,
              resolution,
              thumbnailUrl,
            });
            return;
          }
        } catch (e) {
          console.warn('Canvas thumbnail generation failed, using fallback:', e);
        }
        cleanUp();
        resolve({
          duration,
          width,
          height,
          resolution,
          thumbnailUrl: generateFallbackThumbnail(file.name, resolution),
        });
      };

      video.onerror = () => {
        cleanUp();
        resolve({
          duration: 30,
          width: 1920,
          height: 1080,
          resolution: '1080p FHD',
          thumbnailUrl: generateFallbackThumbnail(file.name, '1080p FHD'),
        });
      };
    };

    video.onerror = () => {
      cleanUp();
      resolve({
        duration: 30,
        width: 1920,
        height: 1080,
        resolution: '1080p FHD',
        thumbnailUrl: generateFallbackThumbnail(file.name, '1080p FHD'),
      });
    };
  });
}

export function generateFallbackThumbnail(title: string, resolution: VideoResolution): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const grad = ctx.createLinearGradient(0, 0, 640, 360);
  grad.addColorStop(0, '#1d4ed8');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 360);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 640; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 360);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(320, 160, 42, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(312, 142);
  ctx.lineTo(336, 160);
  ctx.lineTo(312, 178);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(resolution, 40, 50);

  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  const displayTitle = title.length > 36 ? title.substring(0, 34) + '...' : title;
  ctx.fillText(displayTitle, 40, 320);

  return canvas.toDataURL('image/jpeg', 0.9);
}

export const defaultCategories: LearningCategory[] = [
  {
    id: 'cat1',
    nameKm: 'វីដេអូការងារ & ឯកសារ',
    nameEn: 'Work & Documents',
    badge: 'ការងារ',
    color: 'bg-blue-600',
    icon: 'briefcase',
    img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=80',
    descriptionKm: 'វីដេអូការងារ ឯកសារបង្រៀន និងរបាយការណ៍ប្រព័ន្ធ',
    descriptionEn: 'Work videos, tutorial documents and system reports',
  },
  {
    id: 'cat2',
    nameKm: 'វីដេអូផ្ទាល់ខ្លួន',
    nameEn: 'Personal Videos',
    badge: 'ផ្ទាល់ខ្លួន',
    color: 'bg-emerald-600',
    icon: 'user',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    descriptionKm: 'ការធ្វើដំណើរ វិស្សមកាល និងអនុស្សាវរីយ៍ផ្ទាល់ខ្លួន',
    descriptionEn: 'Travel, vacation and personal memories',
  },
  {
    id: 'cat3',
    nameKm: 'រូបភាពអនុស្សាវរីយ៍',
    nameEn: 'Photos & Memories',
    badge: 'រូបភាព',
    color: 'bg-purple-600',
    icon: 'image',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    descriptionKm: 'រូបថតអនុស្សាវរីយ៍ និងវិស្សមកាលផ្សេងៗ',
    descriptionEn: 'Memory photos, album pictures and events',
  },
  {
    id: 'cat4',
    nameKm: 'តន្ត្រី & កម្សាន្ត',
    nameEn: 'Music & Entertainment',
    badge: 'តន្ត្រី',
    color: 'bg-indigo-600',
    icon: 'music',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    descriptionKm: 'ចម្រៀង តន្ត្រី ការកម្សាន្ត និងវីដេអូផ្សេងៗ',
    descriptionEn: 'Music, songs, and entertainment videos',
  },
];

export const sampleInitialVideos: StoredVideo[] = [
  {
    id: 'vid_1_tms_pwd',
    type: 'video',
    title: 'IMG_8992.MP4 - ការផ្លាស់ប្តូរលេខសម្ងាត់ក្នុង TMS',
    description: 'ការណែនាំពីជំហានសុវត្ថិភាពក្នុងការផ្លាស់ប្តូរលេខសម្ងាត់ប្រព័ន្ធ TMS (User Management Security Guide)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: generateFallbackThumbnail('IMG_8992.MP4 - TMS Password', '720p HD'),
    size: 14.7 * 1024 * 1024,
    duration: 119,
    quality: '720p HD',
    width: 1280,
    height: 720,
    mimeType: 'video/mp4',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    category: 'cat1',
    tags: ['TMS', 'Tutorial', 'Security', 'Khmer'],
    favorite: true,
    source: 'sample',
    cloudSynced: true,
    views: 42,
  },
  {
    id: 'vid_2_angkor_wat',
    type: 'video',
    title: 'Angkor Wat Sunrise - Siem Reap 4K Drone Footage',
    description: 'Breathtaking 4K aerial sunrise over the ancient towers of Angkor Wat temple complex in Cambodia.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: generateFallbackThumbnail('Angkor Wat Sunrise 4K', '4K UHD'),
    size: 150.7 * 1024 * 1024,
    duration: 596,
    quality: '4K UHD',
    width: 3840,
    height: 2160,
    mimeType: 'video/mp4',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    category: 'cat2',
    tags: ['Cambodia', 'Angkor', 'Drone', '4K'],
    favorite: false,
    source: 'sample',
    cloudSynced: true,
    views: 128,
  },
  {
    id: 'vid_3_koh_rong',
    type: 'video',
    title: 'Koh Rong Sanloem Island Crystal Waves FHD',
    description: 'Emerald clear ocean waves and white sand beaches of Koh Rong island.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: generateFallbackThumbnail('Koh Rong Island FHD', '1080p FHD'),
    size: 40.1 * 1024 * 1024,
    duration: 15,
    quality: '1080p FHD',
    width: 1920,
    height: 1080,
    mimeType: 'video/mp4',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    category: 'cat2',
    tags: ['Beach', 'Nature', 'Ocean', 'Summer'],
    favorite: true,
    source: 'sample',
    cloudSynced: true,
    views: 75,
  },
  {
    id: 'img_1_koh_rong_photo',
    type: 'image',
    title: 'Koh_Rong_Sanloem_Island_Photo.JPG',
    description: 'Crystal clear emerald seawater and white sand beach photography at Koh Rong Sanloem.',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80',
    size: 3.2 * 1024 * 1024,
    duration: 0,
    quality: '4K UHD',
    width: 3840,
    height: 2160,
    mimeType: 'image/jpeg',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    category: 'cat3',
    tags: ['Photography', 'Island', 'Travel', 'HD'],
    favorite: true,
    source: 'sample',
    cloudSynced: true,
    views: 93,
  },
  {
    id: 'img_2_angkor_temple',
    type: 'image',
    title: 'Angkor_Wat_Heritage_Sunset.JPG',
    description: 'Majestic ancient towers of Angkor Wat reflecting golden hour sunset in lotus reflecting pond.',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=80',
    size: 4.8 * 1024 * 1024,
    duration: 0,
    quality: '4K UHD',
    width: 4000,
    height: 2667,
    mimeType: 'image/jpeg',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    category: 'cat3',
    tags: ['Heritage', 'Angkor', 'SiemReap', '4K'],
    favorite: false,
    source: 'sample',
    cloudSynced: true,
    views: 64,
  },
];

export const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    categoryId: 'beginner',
    questionEn: 'Which of the following is the correct English phrase for asking someone their name?',
    questionKm: 'តើឃ្លាភាសាអង់គ្លេសមួយណាដែលត្រឹមត្រូវសម្រាប់សួរសុំឈ្មោះនរណាម្នាក់?',
    options: [
      { id: 'a', text: 'What is your name?', isCorrect: true },
      { id: 'b', text: 'Who you name are?', isCorrect: false },
      { id: 'c', text: 'Where name yours?', isCorrect: false },
      { id: 'd', text: 'How is name called?', isCorrect: false },
    ],
    explanation: '"What is your name?" is the standard polite greeting and question in English.',
  },
  {
    id: 'q2',
    categoryId: 'beginner',
    questionEn: 'Complete the sentence: "She _____ English every morning."',
    questionKm: 'បំពេញចន្លោះ៖ "She _____ English every morning."',
    options: [
      { id: 'a', text: 'studies', isCorrect: true },
      { id: 'b', text: 'study', isCorrect: false },
      { id: 'c', text: 'studying', isCorrect: false },
      { id: 'd', text: 'are study', isCorrect: false },
    ],
    explanation: 'With singular third-person subject (She), the present simple tense takes -ies: studies.',
  },
  {
    id: 'q3',
    categoryId: 'intermediate',
    questionEn: 'What is the meaning of the idiom "Break the ice"?',
    questionKm: 'តើឃ្លាសំនួន "Break the ice" មានន័យថាយ៉ាងណា?',
    options: [
      { id: 'a', text: 'Make people feel more comfortable in a social setting', isCorrect: true },
      { id: 'b', text: 'Freeze cold water into cubes', isCorrect: false },
      { id: 'c', text: 'Break a glass by accident', isCorrect: false },
      { id: 'd', text: 'Stop speaking immediately', isCorrect: false },
    ],
    explanation: '"Break the ice" means doing or saying something to relieve tension or start conversation comfortably.',
  },
  {
    id: 'q4',
    categoryId: 'advanced',
    questionEn: 'Choose the word that best fits: "The manager gave a very _____ presentation that convinced all investors."',
    questionKm: 'ជ្រើសរើសពាក្យដែលត្រឹមត្រូវបំផុត៖ "The manager gave a very _____ presentation that convinced all investors."',
    options: [
      { id: 'a', text: 'persuasive', isCorrect: true },
      { id: 'b', text: 'hesitant', isCorrect: false },
      { id: 'c', text: 'ambiguous', isCorrect: false },
      { id: 'd', text: 'reluctant', isCorrect: false },
    ],
    explanation: '"Persuasive" means good at making someone believe or do something through argument.',
  },
];

export const sampleVocabList: VocabItem[] = [
  {
    id: 'v1',
    word: 'Vocabulary',
    phonetic: '/vəˈkæb.jə.lər.i/',
    partOfSpeech: 'noun',
    meaningKm: 'វាក្យសព្ទ ឬពាក្យគន្លឹះក្នុងការរៀនភាសា',
    meaningEn: 'All the words known and used by a particular person',
    exampleSentence: 'Reading books is the best way to expand your vocabulary.',
    exampleKhmer: 'ការអានសៀវភៅគឺជាវិធីដ៏ល្អបំផុតក្នុងការបង្កើនវាក្យសព្ទរបស់អ្នក។',
    category: 'beginner',
    learned: true,
  },
  {
    id: 'v2',
    word: 'Fluency',
    phonetic: '/ˈfluː.ən.si/',
    partOfSpeech: 'noun',
    meaningKm: 'ភាពស្ទាត់ជំនាញក្នុងការនិយាយ ឬសរសេរ',
    meaningEn: 'The ability to speak or write a language easily and accurately',
    exampleSentence: 'Practice speaking daily to achieve full fluency.',
    exampleKhmer: 'អនុវត្តការនិយាយរាល់ថ្ងៃដើម្បីទទួលបានភាពស្ទាត់ជំនាញពេញលេញ។',
    category: 'intermediate',
    learned: false,
  },
  {
    id: 'v3',
    word: 'Comprehension',
    phonetic: '/ˌkɑːm.prəˈhen.ʃən/',
    partOfSpeech: 'noun',
    meaningKm: 'ការយល់ដឹង ឬការចាប់បានន័យច្បាស់លាស់',
    meaningEn: 'The ability to understand something completely',
    exampleSentence: 'Watching videos with subtitles improves listening comprehension.',
    exampleKhmer: 'ការទស្សនាវីដេអូជាមួយអត្ថបទរត់ជួយពង្រឹងការស្តាប់ស្វែងយល់។',
    category: 'intermediate',
    learned: true,
  },
  {
    id: 'v4',
    word: 'Articulate',
    phonetic: '/ɑːrˈtɪk.jə.lət/',
    partOfSpeech: 'adjective / verb',
    meaningKm: 'ការបញ្ចេញគំនិតបានច្បាស់លាស់ និងក្បោះក្បាយ',
    meaningEn: 'Able to express thoughts and ideas clearly and effectively',
    exampleSentence: 'She gave an articulate summary of the quarterly results.',
    exampleKhmer: 'នាងបានផ្តល់ការសង្ខេបលទ្ធផលត្រីមាសយ៉ាងក្បោះក្បាយ និងច្បាស់លាស់។',
    category: 'advanced',
    learned: false,
  },
];
