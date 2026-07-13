const https = require('https');
const fs = require('fs');
const path = require('path');

const IMAGE_API = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';

const OUTPUT_BASE = path.join(__dirname, 'public', 'images');
const CHARACTERS_DIR = path.join(OUTPUT_BASE, 'characters');
const BACKGROUNDS_DIR = path.join(OUTPUT_BASE, 'backgrounds');

[CHARACTERS_DIR, BACKGROUNDS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});



function buildCharacterPrompt(desc) {
  return `masterpiece, best quality, ultra-detailed, anime visual novel sprite, bishoujo game style, 1girl, solo, ${desc}, full body, standing, white background, studio lighting, beautiful detailed face, beautiful detailed eyes, perfect anatomy, no text, no watermark`;
}

function buildBackgroundPrompt(desc) {
  return `masterpiece, best quality, ultra-detailed, anime visual novel background, scenic background, no humans, ${desc}, beautiful lighting, cinematic composition, detailed environment, atmospheric perspective, rich colors, no text, no watermark`;
}

const CHARACTER_IMAGES = [
  {
    folder: 'sakura',
    name: '星野樱',
    images: [
      {
        file: 'default.jpg',
        outfit: '制服',
        desc: 'bright cheerful pink long hair, slightly wavy ends, cute ahoge on top, large sparkling sky blue eyes, warm energetic smile, open mouth laughing, wearing dark blue magic academy uniform, white dress shirt, dark blue pleated skirt, red ribbon bow tie, black thighhighs, brown loafers, gold star-shaped badge on chest, waving hand energetically, sunny optimistic personality, youthful and lively, soft pink lips, fair skin, blushing slightly'
      },
      {
        file: 'battle.jpg',
        outfit: '战斗服',
        desc: 'bright pink long hair flowing dynamically in wind, determined confident eyes, wearing pink and white magical girl battle outfit, frills and star decorations, glowing magical runes on fabric, holding a glowing pink magic orb in hand, combat ready stance, sparkles and star particles surrounding her, glowing aura, heroic expression, magical girl aesthetic, ribbons flowing, powerful and cute'
      }
    ]
  },
  {
    folder: 'suzu',
    name: '风铃铃',
    images: [
      {
        file: 'default.jpg',
        outfit: '制服',
        desc: 'soft dark purple bob cut hair to shoulders, wearing thin rimmed glasses, gentle lavender eyes, shy timid expression, slightly blushing cheeks, looking down modestly, wearing dark blue magic academy uniform, holding a large thick ancient magic book close to chest, slightly bowing posture, quiet introverted bookworm personality, soft gentle features, fair skin, cute nerdy girl'
      },
      {
        file: 'battle.jpg',
        outfit: '战斗服',
        desc: 'dark purple short hair flowing, glasses reflecting intelligent light, focused serious eyes, wearing purple and white long magic robe with hood down, covered in ancient glowing magic runes and symbols, multiple floating magic books surrounding her, magic circle glowing beneath feet, pages flipping in air, wise mysterious sage aesthetic, scholarly powerful aura, arcane glyphs glowing'
      }
    ]
  },
  {
    folder: 'rin',
    name: '岸岛凛',
    images: [
      {
        file: 'default.jpg',
        outfit: '制服',
        desc: 'sharp silver white high ponytail, fierce golden orange eyes, tsundere expression, blushing cheeks while looking away haughtily, arms crossed under chest, wearing dark blue magic academy uniform, ornate decorative sword at waist, cold proud personality, beautiful sharp features, elegant yet stubborn, fair skin, elegant posture, honor student vibe'
      },
      {
        file: 'battle.jpg',
        outfit: '战斗服',
        desc: 'silver white ponytail flowing in battle wind, sharp piercing eyes, wearing silver and dark blue knight-style battle outfit, metal shoulder armor and gauntlets, holding a glowing enchanted magic sword in hand, wind attribute light effects on blade, sword aura surrounding her, combat stance, cool and beautiful warrior maiden, sparks and wind particles, gallant and powerful'
      }
    ]
  },
  {
    folder: 'aoi',
    name: '石上葵',
    images: [
      {
        file: 'default.jpg',
        outfit: '制服',
        desc: 'soft wavy sky blue long hair, mature gentle emerald green eyes, warm kind motherly smile, gentle caring expression, wearing dark blue magic academy uniform with a light cream cardigan over it, reaching out hand gently, mature elegant onee-san type, soft warm features, tender personality, fair skin, comforting presence, gentle curves'
      },
      {
        file: 'battle.jpg',
        outfit: '战斗服',
        desc: 'sky blue long hair flowing like water, gentle yet determined eyes, wearing blue and white healer-style magical outfit with light blue ribbons, hands glowing with warm healing golden light, water droplets and light particles floating around, soft halo behind her, holy gentle priestess aesthetic, warm healing aura, kind and powerful'
      }
    ]
  },
  {
    folder: 'yuzu',
    name: '天音柚子',
    images: [
      {
        file: 'default.jpg',
        outfit: '制服',
        desc: 'playful bright orange twin tails with pink dip-dye ends, large mischievous yellow green cat eyes, cheeky expression sticking tongue out, doing playful peace sign, wearing dark blue magic academy uniform messily, collar unbuttoned, sleeves rolled up, mismatched socks, little devil prankster personality, energetic playful, cute troublemaker, fair skin, lively expression'
      },
      {
        file: 'battle.jpg',
        outfit: '战斗服',
        desc: 'orange twin tails bouncing with energy, mischievous excited eyes, wearing orange and black punk-style magical outfit with lightning bolt decorations, holding two glowing magical wands, electric sparks and energy balls around her, dynamic action pose, playful yet powerful, little devil battle aura, lightning effects, energetic and chaotic'
      }
    ]
  },
  {
    folder: 'mashiro',
    name: '白石真白',
    images: [
      {
        file: 'default.jpg',
        outfit: '制服',
        desc: 'elegant pure white long straight hair reaching waist, cold ice blue narrow phoenix eyes, expressionless cool face, porcelain fair skin, wearing perfectly pressed dark blue magic academy uniform immaculately, standing elegantly with cold demeanor, looking down coldly, high class ojou-sama vibe, ice queen kuudere personality, beautiful flawless features, regal posture'
      },
      {
        file: 'battle.jpg',
        outfit: '战斗服',
        desc: 'white long hair flowing in magical energy, cold sharp piercing eyes, wearing white and gold elaborate magical gown with ice crystal decorations and delicate lace trims, ice crystals and snowflakes floating around, freezing effect on ground below, powerful ice blue magic forming in hands, cold beautiful queen aesthetic, frost and snow aura, elegant and terrifyingly powerful'
      }
    ]
  }
];

const BACKGROUND_IMAGES = [
  {
    file: 'academy_gate.jpg',
    desc: 'magnificent grand European-style magic academy main gate, towering stone pillars carved with complex magical runes and patterns glowing faintly blue, ornate iron gate with decorative designs, ancient magical text on archway above, wide stone steps leading to gate, magic lamp posts on both sides of path, lush green trees surrounding, clear blue sky with white clouds, bright warm sunlight, solemn mysterious fantasy atmosphere, daytime, warm lighting'
  },
  {
    file: 'classroom.jpg',
    desc: 'spacious bright magic classroom interior, neat rows of wooden desks and chairs, each desk has crystal ball, magic wand, quill pen and ink bottle, blackboard with magic spells and magic circle diagrams drawn, glowing floating magic crystal ball on lectern as light source, large windows showing academy courtyard and blue sky outside, warm beige stone walls, bookshelves filled with ancient magic books, sunbeams streaming through windows with dust motes dancing, warm cozy study atmosphere, daytime'
  },
  {
    file: 'library.jpg',
    desc: 'huge ancient magical library interior, towering bookshelves reaching ceiling filled with colorful ancient magic books, some books faintly glowing, tall stained glass windows casting colorful light beams, reading area with comfortable leather sofas and wooden desks, several books floating in air turning pages by themselves, warm magic lamp lighting, ladder leaning against bookshelf, dust particles in light beams, quiet mysterious scholarly atmosphere, warm indoor lighting'
  },
  {
    file: 'forest.jpg',
    desc: 'mysterious enchanted magic forest, tall ancient trees with thick trunks, dense canopy blocking sky, dreamy blue-green leaves, some trees faintly glowing bioluminescent, ground covered with moss and glowing mushrooms, winding path leading deep into forest, dappled sunlight filtering through leaves, tiny glowing fairies floating in air, mist in distance, gentle stream visible, mysterious dreamy atmosphere, afternoon sun through trees'
  },
  {
    file: 'cafeteria.jpg',
    desc: 'spacious lively academy cafeteria dining hall, long tables with clean tablecloths, various delicious foods on serving counter: breads, fruits, soups, desserts, high ceiling with magic chandeliers, large windows showing courtyard outside, empty seats waiting for students, warm lively atmosphere full of life, bright lunchtime lighting, warm color tones, cozy inviting'
  },
  {
    file: 'dormitory.jpg',
    desc: 'cozy cute girls dormitory bedroom, two beds with cute sheets and pillows plus plush toys, desks with books, desk lamp, photo frames, small balcony with starry sky visible through window, posters on wall, magical trinkets and decorations, soft carpet, wardrobe half open with uniforms hanging, warm and girly arrangement, warm soft lighting at night, yellow lamp glow, night time bedroom'
  },
  {
    file: 'night_sky.jpg',
    desc: 'magnificent brilliant starry night sky, countless bright stars twinkling in deep dark blue-black sky, Milky Way clearly visible, shooting stars streaking across, silhouette of academy buildings below, magic tower spires in outline, distant mountain silhouettes, fireflies dancing over grass, romantic dreamy atmosphere, deep night, dark blue tones, spectacular starlight'
  }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stats = fs.statSync(filepath);
        resolve(stats.size);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function generateAll() {
  console.log('=== Starting image generation ===\n');

  console.log('--- Generating character sprites ---');
  for (const char of CHARACTER_IMAGES) {
    const charDir = path.join(CHARACTERS_DIR, char.folder);
    if (!fs.existsSync(charDir)) fs.mkdirSync(charDir, { recursive: true });

    for (const img of char.images) {
      console.log(`Generating ${char.name} - ${img.outfit}...`);
      const prompt = encodeURIComponent(buildCharacterPrompt(img.desc));
      const url = `${IMAGE_API}?prompt=${prompt}&image_size=portrait_4_3`;
      const filepath = path.join(charDir, img.file);
      try {
        const size = await downloadImage(url, filepath);
        console.log(`  ✓ Saved ${img.file} (${(size/1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  ✗ Failed: ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\n--- Generating backgrounds ---');
  for (const bg of BACKGROUND_IMAGES) {
    console.log(`Generating background: ${bg.file}...`);
    const prompt = encodeURIComponent(buildBackgroundPrompt(bg.desc));
    const url = `${IMAGE_API}?prompt=${prompt}&image_size=landscape_16_9`;
    const filepath = path.join(BACKGROUNDS_DIR, bg.file);
    try {
      const size = await downloadImage(url, filepath);
      console.log(`  ✓ Saved ${bg.file} (${(size/1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n=== Generation complete! ===');
}

generateAll().catch(console.error);
