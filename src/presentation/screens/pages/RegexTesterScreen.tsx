import React, { useMemo } from 'react';
import { useRoute, useFocusEffect, RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/AppNavigator';
import { RegexTesterViewModel } from '../../features/regexTester/viewmodels/RegexTesterViewModel';
import { RegexParserDataSource } from '../../../data/datasources/RegexParserDataSource';
import { RegexRepositoryImpl } from '../../../data/repositories_impl/RegexRepositoryImpl';
import { ParseRegexUseCase } from '../../../domain/usecases/ParseRegexUseCase';
import { RegexTesterTemplate } from '../../templates/RegexTesterTemplate';

export const RegexTesterScreen = observer(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RegexTester'>>();

  const viewModel = useMemo(() => {
    const dataSource = new RegexParserDataSource();
    const repository = new RegexRepositoryImpl(dataSource);
    const useCase = new ParseRegexUseCase(repository);
    return new RegexTesterViewModel(useCase);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.pattern && typeof route.params.flags === 'string') {
        viewModel.setPattern(route.params.pattern);
        viewModel.setFlags(route.params.flags);
      }
    }, [route.params])
  );

  return (
    <RegexTesterTemplate
      inputText={viewModel.inputText}
      pattern={viewModel.pattern}
      flags={viewModel.flags}
      matches={viewModel.result?.matches ?? []}
      indices={viewModel.result?.indices ?? []}
      ast={viewModel.result?.ast ?? null}
      flagError={viewModel.flagError ?? undefined}
      onInputChange={viewModel.setInputText.bind(viewModel)}
      onPatternChange={viewModel.setPattern.bind(viewModel)}
      onFlagsChange={viewModel.setFlags.bind(viewModel)}
      onOpenHistory={() => navigation.navigate('History')}
    />
  );
});
