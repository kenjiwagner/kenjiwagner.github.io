import { parse } from 'yaml';
import raw from '../data/resume.yaml?raw';

export interface Resume {
  experience: {
    org: string;
    location: string;
    period: string;
    roles: { title: string; period?: string }[];
    bullets: string[];
  }[];
  education: { school: string; degree: string; location: string; period: string }[];
  leadership: { org: string; title: string; location: string; period: string; bullets: string[] }[];
  skills: Record<string, string[]>;
}

export const resume = parse(raw) as Resume;
