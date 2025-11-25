import axios from 'axios'

export interface PubMedArticle{
	id: string;
	title: string;
	authors: string;
	url: string;
	pubDate: string;
}

interface ESearchResponse{
	esearchresult: {
		idlist: string[];
	};
}

interface ESummaryResult{
	uid: string;
	title: string;
	pubdate: string;
	authors: { name: string }[];
	[key: string]: any;
}

interface ESummaryResponse{
	result: {
		uids: string[];
		[key: string]: ESummaryResult | string[];
	}
}

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export const searchPubMed = async (query: string): Promise<PubMedArticle[]> => {
  try {
    const searchTerm = `${query} AND veterinary`;

    const searchRes = await axios.get<ESearchResponse>(`${BASE_URL}/esearch.fcgi`, {
      params: {
        db: 'pubmed',
        term: searchTerm,
        retmode: 'json',
        retmax: 3
      }
    });

    const ids = searchRes.data.esearchresult.idlist;

    if (!ids || ids.length === 0) {
      console.log('Nenhum artigo encontrado.');
      return [];
    }

    const summaryRes = await axios.get<ESummaryResponse>(`${BASE_URL}/esummary.fcgi`, {
      params: {
        db: 'pubmed',
        id: ids.join(','),
        retmode: 'json'
      }
    });

    const results = summaryRes.data.result;

    const articles: PubMedArticle[] = results.uids.map((id) => {
      const item = results[id] as ESummaryResult;

      return {
        id: item.uid,
        title: item.title,
        authors: item.authors
          ? item.authors.map(a => a.name).slice(0, 2).join(', ') + (item.authors.length > 2 ? ' et al.' : '')
          : 'Autores desconhecidos',
        pubDate: item.pubdate,
        url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`
      };
    });

    console.log(`${articles.length} artigos encontrados.`);
    return articles;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na API do PubMed:', error.message);
    } else {
      console.error('Erro desconhecido no serviço PubMed:', error);
    }
    return [];
  }
};
