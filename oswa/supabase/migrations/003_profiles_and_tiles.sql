-- Migration 003: Profiles and Tiles
-- جداول الحساب الشخصي والمربعات العائمة

-- 1. جدول الملف الشخصي (Profiles) مع سياسات الأمان RLS
create table if not exists profiles (
  user_id uuid primary key references auth.users on delete cascade,
  display_name text,
  gender text check (gender in ('male','female','undisclosed')),
  age int check (age between 3 and 120),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

-- سياسات RLS: المستخدم يقرأ ويعدل ويحذف صفه الخاص فقط
create policy "own row select" on profiles for select using (auth.uid() = user_id);
create policy "own row insert" on profiles for insert with check (auth.uid() = user_id);
create policy "own row update" on profiles for update using (auth.uid() = user_id);
create policy "own row delete" on profiles for delete using (auth.uid() = user_id);

-- 2. جدول المربعات العائمة (Tiles)
create table if not exists tiles (
  id text primary key,
  title text not null,
  content text not null,
  placement text default 'home',
  accent_color text check (accent_color in ('olive', 'gold', 'sand', 'sage', 'clay')) default 'olive',
  size text check (size in ('sm', 'md', 'lg')) default 'md',
  is_sharia_text boolean default false,
  source_book text,
  source_ref text,
  narrator text,
  grade text,
  lesson text,
  prophetic_method text,
  status text check (status in ('approved', 'demo', 'pending', 'rejected')) default 'approved',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tiles enable row level security;

create policy "tiles_read_approved" on tiles
  for select using (status = 'approved' or status = 'demo');

-- بيانات أولية للمربعات في الرئيسية (demo / approved)
insert into tiles (id, title, content, placement, accent_color, size, is_sharia_text, source_book, source_ref, narrator, grade, lesson, prophetic_method, status, sort_order)
values
(
  'tile-1',
  'الرفق في كل أمر',
  '«إن الرفق لا يكون في شيء إلا زانه، ولا ينزع من شيء إلا شانه»',
  'home',
  'olive',
  'lg',
  true,
  'صحيح مسلم',
  '2594',
  'عائشة رضي الله عنها',
  'صحيح',
  'التعامل باللين والرفق هو الأصل النبوي في سائر شؤون الحياة والتعامل مع الناس.',
  'الهدوء واللين في مواجهة الشدة والانفعال.',
  'approved',
  1
),
(
  'tile-2',
  'مواساة القلوب الحزينة',
  'كان النبي ﷺ يتفقد أصحابه حتى صغارهم، وكان يمازح أبا عمير قائلاً: «يا أبا عمير، ما فعل النغير؟» تطييباً لخاطره.',
  'home',
  'gold',
  'md',
  false,
  'صحيح البخاري ومسلم',
  '6203',
  'أنس بن مالك رضي الله عنه',
  'متفق عليه',
  'مراعاة مشاعر الآخرين، حتى في تفاصيلهم البسيطة، تعبير عميق عن الرحمة النبوية.',
  'الملاطفة والتفقد المستمر للصغير والكبير.',
  'approved',
  2
),
(
  'tile-3',
  'التفاؤل والكلمة الطيبة',
  '«ويعجبني الفأل: الكلمة الحسنة، الكلمة الطيبة»',
  'home',
  'sage',
  'sm',
  true,
  'صحيح البخاري',
  '5776',
  'أبو هريرة رضي الله عنه',
  'صحيح',
  'بث الأمل وحسن الظن بالله يمنحان النفس القوة والصبر في أصعب الظروف.',
  'اختيار الكلمة الطيبة والبشارة بالخير.',
  'approved',
  3
),
(
  'tile-4',
  'الصبر عند الصدمة الأولى',
  'مر النبي ﷺ بامرأة تبكي عند قبر فقال: «اتقي الله واصبري»، ثم قال لها: «إنما الصبر عند الصدمة الأولى».',
  'home',
  'sand',
  'md',
  true,
  'صحيح البخاري',
  '1283',
  'أنس بن مالك رضي الله عنه',
  'متفق عليه',
  'أعظم درجات الصبر والاحتساب تكون في اللحظات الأولى لوقوع البلاء.',
  'التذكير الهادئ والتفهم لحالة المصاب دون تعنيف.',
  'approved',
  4
),
(
  'tile-5',
  'العفو عند المقدرة',
  'حين تمكن النبي ﷺ من أهل مكة بعد سنوات من الأذى والإخراج، قال لهم: «اذهبوا فأنتم الطلقاء».',
  'home',
  'clay',
  'lg',
  false,
  'سيرة ابن هشام / السنن الكبرى للبيهقي',
  'ج 9 ص 118',
  'إطلاق عام',
  'حسن بشواهده',
  'الصفح والتجاوز يعلي من شأن الإنسان ويؤلف القلوب المتنافرة.',
  'استبدال الانتقام بالعفو والمغفرة ونبذ التشفي.',
  'approved',
  5
),
(
  'tile-6',
  'الأمر باليسر والتبشير',
  '«يسروا ولا تعسروا، وبشروا ولا تنفروا»',
  'home',
  'gold',
  'sm',
  true,
  'صحيح البخاري ومسلم',
  '69',
  'أنس بن مالك رضي الله عنه',
  'متفق عليه',
  'المنهج النبوي قائم على التيسير والتخفيف ومراعاة طاقات الناس وقدراتهم.',
  'تقديم البشارة والرجاء على الزجر والتخويف.',
  'approved',
  6
),
(
  'tile-7',
  'قيمة العمل الصالح الدائم',
  '«أحب الأعمال إلى الله أدومها وإن قل»',
  'home',
  'olive',
  'md',
  true,
  'صحيح البخاري',
  '6464',
  'عائشة رضي الله عنها',
  'متفق عليه',
  'الاستمرارية والانضباط في الخير أهم من الكثرة المتقطعة التي يعقبها انقطاع.',
  'التدرج وتثبيت العادات الإيجابية اليومية.',
  'approved',
  7
),
(
  'tile-8',
  'الرحمة بالخلق جميعاً',
  'دخل النبي ﷺ بستاناً فرأى جملاً يذرف دمعاً، فمسح على ذفراه فسكن، ثم عاتب صاحبه على إتعابه له.',
  'home',
  'sage',
  'md',
  false,
  'سنن أبي داود ومسند أحمد',
  '2549',
  'عبدالله بن جعفر رضي الله عنه',
  'صحيح',
  'رحمة النبي ﷺ شملت الحيوان والطبيعة والإنسان دون استثناء.',
  'النهي عن الإيذاء وتحمل المسؤولية الأخلاقية تجاه الضعفاء.',
  'approved',
  8
)
on conflict (id) do nothing;
