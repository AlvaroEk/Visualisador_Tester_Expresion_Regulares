import React from 'react';
import { observer } from 'mobx-react-lite';
import { RegexTesterTemplate } from '../../templates/RegexTesterTemplate';
import { RegexTesterViewModel } from '../../regexTester/viewmodels/RegexTesterViewModel';
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
import { RegexRepositoryImpl } from '../../../../data/repositories_impl/RegexRepositoryImpl';
import { RegexParserDataSource } from '../../../../data/datasources/RegexParserDataSource';

const repo = new RegexRepositoryImpl(new RegexParserDataSource());
const useCase = new ParseRegexUseCase(repo);
const viewModel = new RegexTesterViewModel(useCase);

export const RegexTesterScreen = observer(() => {
  return (
    <RegexTesterTemplate
      inputText={viewModel.inputText}
      pattern={viewModel.pattern}
      flags={viewModel.flags}
      matches={viewModel.result?.matches}
      ast={viewModel.result?.ast}
      flagError={viewModel.flagError}
      onInputChange={(text: string) => viewModel.setInputText(text)}
      onPatternChange={(text: string) => viewModel.setPattern(text)}
      onFlagsChange={(text: string) => viewModel.setFlags(text)}
    />
  );
});

