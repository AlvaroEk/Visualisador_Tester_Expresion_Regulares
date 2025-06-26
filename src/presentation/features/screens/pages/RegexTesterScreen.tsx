import React from 'react';
import { observer } from 'mobx-react-lite';
import { RegexTesterTemplate } from '../../templates/RegexTesterTemplate';
import { RegexTesterViewModel } from '../../regexTester/viewmodels/RegexTesterViewModel';
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
import { RegexRepositoryImpl } from '../../../../data/repositories_impl/RegexRepositoryImpl';
import { RegexParserDataSource } from '../../../../data/datasources/RegexParserDataSource';

const dataSource = new RegexParserDataSource();
const repository = new RegexRepositoryImpl(dataSource);
const useCase = new ParseRegexUseCase(repository);
const viewModel = new RegexTesterViewModel(useCase);

export const RegexTesterScreen = observer(() => {
  return (
    <RegexTesterTemplate
      inputText={viewModel.inputText}
      pattern={viewModel.pattern}
      flags={viewModel.flags}
      matches={viewModel.result?.matches}
      indices={viewModel.result?.indices}
      ast={viewModel.result?.ast}
      flagError={viewModel.flagError}
      onInputChange={viewModel.setInputText.bind(viewModel)}
      onPatternChange={viewModel.setPattern.bind(viewModel)}
      onFlagsChange={viewModel.setFlags.bind(viewModel)}
    />
  );
});
