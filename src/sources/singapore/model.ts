import { FirebaseTopic } from '../model';

export interface FourDModel {
  drawNo: number;
  drawDate: number;
  winning: number[];
  starter: number[];
  consolation: number[];
}

export interface TotoModel {
  drawNo: number;
  drawDate: number;
  winning: number[];
  additional: number;
  winningShares: TotoPrizeShareModel[];
}

export interface TotoPrizeShareModel {
  group: string;
  prizeAmount: number;
  count: number;
}

export interface SweepModel {
  drawNo: number;
  drawDate: number;
  winning: number[];
  jackpot: number[];
  lucky: number[];
  gift: number[];
  consolation: number[];
  participation: number[];
  twoD: number[];
}

export interface SingaporeUpcomingDatesModel {
  FourD: number;
  Toto: number;
  Sweep: number;
}

export interface SingaporeLottery {
  FourD: FourDModel[];
  Toto: TotoModel[];
  Sweep: SweepModel[];
}

export interface SingaporeLotteryRaw {
  results: SingaporeLottery;
  topics: FirebaseTopic[];
}
