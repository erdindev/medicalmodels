import { PrismaClient } from '@prisma/client';
import https from 'https';

const prisma = new PrismaClient();
const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCharCode(parseInt(n, 16)));
}

const architecturePatterns = [
  { pattern: /inception[-\s]?resnet[-\s]?v2/gi, name: 'Inception-ResNet-v2' },
  { pattern: /inception[-\s]?v3/gi, name: 'Inception-v3' },
  { pattern: /resnet[-\s]?152/gi, name: 'ResNet-152' },
  { pattern: /resnet[-\s]?101/gi, name: 'ResNet-101' },
  { pattern: /resnet[-\s]?50/gi, name: 'ResNet-50' },
  { pattern: /resnet[-\s]?34/gi, name: 'ResNet-34' },
  { pattern: /resnet[-\s]?18/gi, name: 'ResNet-18' },
  { pattern: /resnet/gi, name: 'ResNet' },
  { pattern: /xception/gi, name: 'Xception' },
  { pattern: /densenet[-\s]?201/gi, name: 'DenseNet-201' },
  { pattern: /densenet[-\s]?169/gi, name: 'DenseNet-169' },
  { pattern: /densenet[-\s]?121/gi, name: 'DenseNet-121' },
  { pattern: /densenet/gi, name: 'DenseNet' },
  { pattern: /vgg[-\s]?19/gi, name: 'VGG-19' },
  { pattern: /vgg[-\s]?16/gi, name: 'VGG-16' },
  { pattern: /vgg/gi, name: 'VGG' },
  { pattern: /alexnet/gi, name: 'AlexNet' },
  { pattern: /mobilenet[-\s]?v3/gi, name: 'MobileNet-v3' },
  { pattern: /mobilenet[-\s]?v2/gi, name: 'MobileNet-v2' },
  { pattern: /mobilenet/gi, name: 'MobileNet' },
  { pattern: /efficientnet[-\s]?b\d/gi, name: 'EfficientNet' },
  { pattern: /efficientnet/gi, name: 'EfficientNet' },
  { pattern: /u[-\s]?net\+\+/gi, name: 'U-Net++' },
  { pattern: /u[-\s]?net/gi, name: 'U-Net' },
  { pattern: /faster[-\s]?r[-\s]?cnn/gi, name: 'Faster R-CNN' },
  { pattern: /mask[-\s]?r[-\s]?cnn/gi, name: 'Mask R-CNN' },
  { pattern: /yolo[-\s]?v\d/gi, name: 'YOLO' },
  { pattern: /yolo/gi, name: 'YOLO' },
  { pattern: /lstm/gi, name: 'LSTM' },
  { pattern: /gru/gi, name: 'GRU' },
  { pattern: /bert/gi, name: 'BERT' },
  { pattern: /vision[-\s]?transformer/gi, name: 'Vision Transformer' },
  { pattern: /\bViT\b/g, name: 'Vision Transformer' },
  { pattern: /swin[-\s]?transformer/gi, name: 'Swin Transformer' },
  { pattern: /transformer/gi, name: 'Transformer' },
  { pattern: /attention[-\s]?mechanism/gi, name: 'Attention Network' },
  { pattern: /self[-\s]?attention/gi, name: 'Attention Network' },
  { pattern: /random[-\s]?forest/gi, name: 'Random Forest' },
  { pattern: /xgboost/gi, name: 'XGBoost' },
  { pattern: /lightgbm/gi, name: 'LightGBM' },
  { pattern: /gradient[-\s]?boost/gi, name: 'Gradient Boosting' },
  { pattern: /ensemble/gi, name: 'Ensemble' },
  { pattern: /autoencoder/gi, name: 'Autoencoder' },
  { pattern: /gan\b/gi, name: 'GAN' },
  { pattern: /generative[-\s]?adversarial/gi, name: 'GAN' },
  { pattern: /convolutional[-\s]?neural[-\s]?network/gi, name: 'CNN' },
  { pattern: /\bCNN\b/g, name: 'CNN' },
  { pattern: /\bDNN\b/g, name: 'DNN' },
  { pattern: /\bRNN\b/g, name: 'RNN' },
  { pattern: /recurrent[-\s]?neural/gi, name: 'RNN' },
  { pattern: /fully[-\s]?connected/gi, name: 'FCN' },
  { pattern: /segnet/gi, name: 'SegNet' },
];

function extractArchitecture(text: string): string | null {
  for (const { pattern, name } of architecturePatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) return name;
  }
  return null;
}

function extractScores(text: string): { auc: number | null; accuracy: number | null } {
  let auc: number | null = null;
  let accuracy: number | null = null;

  // AUC patterns
  const aucPatterns = [
    /AUC[^\d]*?(\d+\.?\d*)\s*%/gi,
    /AUC[^\d]*?0\.(\d+)/gi,
    /area\s+under[^\d]*?(\d+\.?\d*)\s*%/gi,
    /area\s+under[^\d]*?0\.(\d+)/gi,
    /AUROC[^\d]*?(\d+\.?\d*)/gi,
    /c-statistic[^\d]*?0\.(\d+)/gi,
  ];

  for (const pattern of aucPatterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      let val = parseFloat(match[1]);
      if (val < 1) val *= 100;
      if (val > 10 && val <= 100) {
        auc = val;
        break;
      }
    }
  }

  // Accuracy patterns
  const accPatterns = [
    /accuracy[^\d]*?(\d+\.?\d*)\s*%/gi,
    /(\d+\.?\d*)\s*%\s*accuracy/gi,
    /accuracy[^\d]*?0\.(\d+)/gi,
  ];

  for (const pattern of accPatterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      let val = parseFloat(match[1]);
      if (val < 1) val *= 100;
      if (val >= 50 && val <= 100) {
        accuracy = val;
        break;
      }
    }
  }

  return { auc, accuracy };
}

// Check if title contains review/meta-analysis keywords
function isReviewArticle(title: string): boolean {
  const reviewPatterns = [
    /\breview\b/i,
    /\bmeta[-\s]?analysis\b/i,
    /\bsystematic\b/i,
    /\boverview\b/i,
    /\bsurvey\b/i,
    /\bstate[-\s]?of[-\s]?the[-\s]?art\b/i,
    /\bguideline/i,
    /\bconsensus\b/i,
    /\bcommentary\b/i,
    /\beditorial\b/i,
    /\bletter to/i,
    /\bopinion\b/i,
  ];

  for (const pattern of reviewPatterns) {
    if (pattern.test(title)) return true;
  }
  return false;
}

interface SpecialtyConfig {
  name: string;
  slug: string;
  meshTerms: string[];
  additionalTerms: string[];
}

const specialties: SpecialtyConfig[] = [
  {
    name: 'Cardiology',
    slug: 'cardiology',
    meshTerms: ['cardiology', 'cardiovascular', 'heart', 'cardiac', 'echocardiography', 'electrocardiography', 'ECG', 'arrhythmia', 'atrial fibrillation', 'myocardial'],
    additionalTerms: ['coronary', 'ventricular', 'aortic', 'mitral', 'valve']
  },
  {
    name: 'Radiology',
    slug: 'radiology',
    meshTerms: ['radiology', 'radiography', 'computed tomography', 'CT scan', 'MRI', 'magnetic resonance', 'X-ray', 'ultrasound imaging'],
    additionalTerms: ['imaging', 'radiograph', 'chest x-ray', 'mammography']
  },
  {
    name: 'Neurology',
    slug: 'neurology',
    meshTerms: ['neurology', 'brain', 'neurological', 'stroke', 'epilepsy', 'seizure', 'alzheimer', 'parkinson', 'EEG', 'electroencephalography'],
    additionalTerms: ['cerebral', 'cognitive', 'dementia', 'multiple sclerosis']
  },
  {
    name: 'Ophthalmology',
    slug: 'ophthalmology',
    meshTerms: ['ophthalmology', 'retina', 'retinal', 'diabetic retinopathy', 'glaucoma', 'macular degeneration', 'fundus', 'OCT'],
    additionalTerms: ['eye', 'optic', 'vision', 'cataract']
  },
  {
    name: 'Oncology',
    slug: 'oncology',
    meshTerms: ['oncology', 'cancer', 'tumor', 'neoplasm', 'carcinoma', 'malignant', 'metastasis', 'lymphoma', 'leukemia'],
    additionalTerms: ['chemotherapy', 'radiotherapy', 'survival prediction', 'prognosis']
  },
  {
    name: 'Pathology',
    slug: 'pathology',
    meshTerms: ['pathology', 'histopathology', 'histology', 'biopsy', 'cytology', 'microscopy', 'whole slide image', 'WSI'],
    additionalTerms: ['tissue', 'cell', 'specimen', 'staining']
  },
  {
    name: 'Gastroenterology',
    slug: 'gastroenterology',
    meshTerms: ['gastroenterology', 'endoscopy', 'colonoscopy', 'gastrointestinal', 'liver', 'hepatic', 'colon polyp'],
    additionalTerms: ['stomach', 'intestinal', 'digestive', 'colorectal']
  },
  {
    name: 'Pulmonology',
    slug: 'pulmonology',
    meshTerms: ['pulmonology', 'lung', 'pulmonary', 'respiratory', 'pneumonia', 'COPD', 'asthma', 'COVID-19', 'tuberculosis'],
    additionalTerms: ['chest', 'bronchial', 'airway']
  }
];

async function getOrCreateSpecialty(config: SpecialtyConfig) {
  let specialty = await prisma.specialty.findUnique({ where: { slug: config.slug } });
  if (!specialty) {
    specialty = await prisma.specialty.create({
      data: { name: config.name, slug: config.slug }
    });
  }
  return specialty;
}

async function getOrCreateUseCase() {
  let useCase = await prisma.useCase.findFirst({ where: { slug: 'diagnosis' } });
  if (!useCase) {
    useCase = await prisma.useCase.create({
      data: { name: 'Diagnosis', slug: 'diagnosis', category: 'Clinical' }
    });
  }
  return useCase;
}

async function scrapeSpecialty(config: SpecialtyConfig, maxResults: number = 200) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Scraping ${config.name}...`);
  console.log(`${'='.repeat(60)}`);

  const specialty = await getOrCreateSpecialty(config);
  const useCase = await getOrCreateUseCase();

  // Build search query
  const meshQuery = config.meshTerms.map(t => `${t}[Title/Abstract]`).join(' OR ');
  const aiTerms = '(deep learning[Title/Abstract] OR neural network[Title/Abstract] OR machine learning[Title/Abstract] OR artificial intelligence[Title/Abstract] OR convolutional[Title/Abstract])';
  const taskTerms = '(detection[Title/Abstract] OR classification[Title/Abstract] OR prediction[Title/Abstract] OR diagnosis[Title/Abstract] OR segmentation[Title/Abstract])';
  const excludeTerms = 'NOT review[Publication Type] NOT meta-analysis[Publication Type] NOT systematic review[Publication Type] NOT editorial[Publication Type] NOT comment[Publication Type] NOT letter[Publication Type]';

  const query = encodeURIComponent(`(${meshQuery}) AND ${aiTerms} AND ${taskTerms} ${excludeTerms}`);

  // Search
  const searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${query}&retmax=${maxResults}&sort=relevance&retmode=json`;

  console.log('Searching PubMed...');
  const searchResult = await fetch(searchUrl);
  const searchData = JSON.parse(searchResult);
  const ids: string[] = searchData.esearchresult.idlist;
  console.log(`Found ${ids.length} papers`);

  if (ids.length === 0) return 0;

  // Fetch in batches of 50
  let savedCount = 0;
  const batchSize = 50;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    console.log(`Fetching batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(ids.length/batchSize)}...`);

    const fetchUrl = `${BASE_URL}/efetch.fcgi?db=pubmed&id=${batchIds.join(',')}&retmode=xml`;
    const fetchResult = await fetch(fetchUrl);

    const articleMatches = fetchResult.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

    for (const article of articleMatches) {
      const pmidMatch = article.match(/<PMID[^>]*>(\d+)<\/PMID>/);
      const pmid = pmidMatch ? pmidMatch[1] : null;
      if (!pmid) continue;

      // Check if already exists
      const existing = await prisma.scrapedPaper.findUnique({ where: { pmid } });
      if (existing) continue;

      const titleMatch = article.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
      let title = titleMatch ? decodeHtmlEntities(titleMatch[1].replace(/<[^>]+>/g, '')) : '';

      // Skip if title indicates review article
      if (isReviewArticle(title)) {
        console.log(`  Skipped (review): ${title.substring(0, 50)}...`);
        continue;
      }

      const abstractMatches = article.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || [];
      let abstract = abstractMatches.map(a => decodeHtmlEntities(a.replace(/<[^>]+>/g, ''))).join(' ');

      if (!title || !abstract || abstract.length < 200) continue;

      const journalMatch = article.match(/<Title>([^<]+)<\/Title>/);
      const journal = journalMatch ? decodeHtmlEntities(journalMatch[1]) : '';

      const authorMatches = article.match(/<LastName>([^<]+)<\/LastName>/g) || [];
      const authors = JSON.stringify(authorMatches.slice(0, 5).map(a => a.replace(/<[^>]+>/g, '')));

      const doiMatch = article.match(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/);
      const doi = doiMatch ? doiMatch[1] : null;

      const architecture = extractArchitecture(title + ' ' + abstract);
      const scores = extractScores(abstract);

      try {
        // Save to ScrapedPaper
        await prisma.scrapedPaper.create({
          data: {
            pmid,
            title,
            abstract,
            journal,
            authors,
            specialty: config.slug,
            pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
            doi,
            hasModel: true,
            reportedAuc: scores.auc ? scores.auc / 100 : null,
            reportedAccuracy: scores.accuracy ? scores.accuracy / 100 : null
          }
        });

        // Create MedicalModel
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50) + '-' + pmid;

        await prisma.medicalModel.create({
          data: {
            name: title,
            slug,
            version: '1.0',
            description: abstract,
            architecture,
            journal,
            specialtyId: specialty.id,
            useCaseId: useCase.id,
            metrics: scores.auc || scores.accuracy ? {
              create: {
                auc: scores.auc ? scores.auc / 100 : null,
                accuracy: scores.accuracy ? scores.accuracy / 100 : null
              }
            } : undefined
          }
        });

        savedCount++;
        const archStr = architecture ? ` [${architecture}]` : '';
        const aucStr = scores.auc ? ` AUC:${scores.auc.toFixed(1)}%` : '';
        console.log(`  + ${title.substring(0, 55)}...${archStr}${aucStr}`);

      } catch (e) {
        // Skip duplicates silently
      }
    }

    // Rate limiting
    await sleep(400);
  }

  console.log(`\n✓ Saved ${savedCount} new ${config.name} models`);
  return savedCount;
}

async function main() {
  console.log('PubMed AI Medical Models Scraper');
  console.log('================================\n');

  const targetSpecialty = process.argv[2];
  const maxResults = parseInt(process.argv[3]) || 200;

  let totalSaved = 0;

  if (targetSpecialty) {
    const config = specialties.find(s => s.slug === targetSpecialty);
    if (config) {
      totalSaved = await scrapeSpecialty(config, maxResults);
    } else {
      console.log('Unknown specialty. Available:', specialties.map(s => s.slug).join(', '));
    }
  } else {
    // Scrape all specialties
    for (const config of specialties) {
      const count = await scrapeSpecialty(config, maxResults);
      totalSaved += count;
      await sleep(1000); // Pause between specialties
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`TOTAL: ${totalSaved} new models saved`);
  console.log(`${'='.repeat(60)}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
